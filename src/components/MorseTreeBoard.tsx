import React from 'react';
import {
  MORSE_TREE_NODES,
  ROOT_POSITION,
  MorseTreeNode,
  getParentPosition,
  getTreeNode,
  getTreePath,
} from '../data/morseTree';
import { morseToDotsAndDashes } from '../data/morseData';
import { useTranslation } from '../i18n/LanguageContext';

interface MorseTreeBoardProps {
  /** 現在の入力バッファ（例: ".-."） */
  code: string;
  /** キー押下中（アンテナを発光） */
  isActive?: boolean;
  /** 確定済みの文字を表示中 */
  committed?: boolean;
  /** ノードクリック時（早見表での再生用） */
  onSelect?: (code: string) => void;
  className?: string;
}

// 格子座標 → SVG 座標
const UNIT_X = 40;
const UNIT_Y = 45;
const OFFSET_X = 30;
const OFFSET_Y = 92;
const VIEW_W = 400;
const VIEW_H = 400;

const px = (x: number) => OFFSET_X + x * UNIT_X;
const py = (y: number) => OFFSET_Y + y * UNIT_Y;

const COLORS = {
  card: '#1b1f4b',
  cardEdge: '#e2e8f0',
  line: '#cbd5e1',
  lineLit: '#4ade80',
  nodeOff: '#0b1024',
  nodeStroke: '#e2e8f0',
  nodePath: '#15803d',
  nodeCurrent: '#4ade80',
  label: '#e2e8f0',
  antennaOff: '#a16207',
  antennaOn: '#fde047',
};

const LABEL_OFFSET = {
  top: { dx: 0, dy: -18, anchor: 'middle' },
  bottom: { dx: 0, dy: 28, anchor: 'middle' },
  left: { dx: -21, dy: 5, anchor: 'end' },
  right: { dx: 21, dy: 5, anchor: 'start' },
} as const;

export const MorseTreeBoard: React.FC<MorseTreeBoardProps> = ({
  code,
  isActive = false,
  committed = false,
  onSelect,
  className = '',
}) => {
  const { t } = useTranslation();
  const path = getTreePath(code);
  const pathSet = new Set(path);
  const currentNode = getTreeNode(code);
  const isNoMatch = code.length > 0 && !currentNode;

  const renderNode = (node: MorseTreeNode) => {
    const cx = px(node.x);
    const cy = py(node.y);
    const isCurrent = node.code === code;
    const isOnPath = pathSet.has(node.code);
    const fill = isCurrent ? COLORS.nodeCurrent : isOnPath ? COLORS.nodePath : COLORS.nodeOff;
    const isDash = node.code.endsWith('-');
    const label = LABEL_OFFSET[node.labelSide];
    const clickable = Boolean(onSelect);

    const shapeProps = {
      fill,
      stroke: COLORS.nodeStroke,
      strokeWidth: 2.5,
      filter: isCurrent ? 'url(#morse-tree-glow)' : undefined,
      style: { transition: 'fill 80ms ease-out' },
    };

    const shape = isDash ? (
      node.orientation === 'v' ? (
        <rect x={cx - 7} y={cy - 15} width={14} height={30} rx={2} {...shapeProps} />
      ) : (
        <rect x={cx - 15} y={cy - 7} width={30} height={14} rx={2} {...shapeProps} />
      )
    ) : (
      <circle cx={cx} cy={cy} r={11} {...shapeProps} />
    );

    return (
      <g
        key={node.code}
        onClick={clickable ? () => onSelect?.(node.code) : undefined}
        role={clickable ? 'button' : undefined}
        aria-label={clickable ? `${node.char} (${morseToDotsAndDashes(node.code)})` : undefined}
        className={clickable ? 'cursor-pointer' : undefined}
      >
        {/* クリック判定を広げる透明領域 */}
        {clickable && <rect x={cx - 20} y={cy - 20} width={40} height={40} fill="transparent" />}
        {shape}
        <text
          x={cx + label.dx}
          y={cy + label.dy}
          textAnchor={label.anchor}
          fontSize={17}
          fontWeight={isCurrent ? 800 : 500}
          fill={isCurrent ? COLORS.nodeCurrent : COLORS.label}
          style={{ pointerEvents: 'none' }}
        >
          {node.char}
        </text>
      </g>
    );
  };

  const renderEdge = (node: MorseTreeNode) => {
    const parent = getParentPosition(node.code);
    const lit = pathSet.has(node.code);
    return (
      <line
        key={`edge-${node.code}`}
        x1={px(parent.x)}
        y1={py(parent.y)}
        x2={px(node.x)}
        y2={py(node.y)}
        stroke={lit ? COLORS.lineLit : COLORS.line}
        strokeWidth={lit ? 3 : 2}
        strokeOpacity={lit ? 0.9 : 0.75}
      />
    );
  };

  const rootX = px(ROOT_POSITION.x);
  const rootY = py(ROOT_POSITION.y);
  const antennaColor = isActive ? COLORS.antennaOn : COLORS.antennaOff;

  return (
    <div className={`w-full flex flex-col items-center gap-1.5 select-none ${className}`}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full max-w-[360px] h-auto"
        role="img"
        aria-label={t.morseTree.title}
      >
        <defs>
          <filter id="morse-tree-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* カード */}
        <rect x={3} y={3} width={VIEW_W - 6} height={VIEW_H - 6} rx={16} fill={COLORS.card} stroke={COLORS.cardEdge} strokeWidth={4} />
        <text x={24} y={44} fontSize={26} fill={COLORS.label} letterSpacing={1}>MORSE</text>
        <text x={VIEW_W - 24} y={44} fontSize={26} fill={COLORS.label} textAnchor="end" letterSpacing={1}>CODE</text>

        {/* 枝 */}
        {MORSE_TREE_NODES.map(renderEdge)}

        {/* アンテナ（ルート） */}
        <g filter={isActive ? 'url(#morse-tree-glow)' : undefined}>
          <line x1={rootX} y1={rootY - 22} x2={rootX} y2={rootY + 10} stroke={antennaColor} strokeWidth={4} strokeLinecap="round" />
          <path
            d={`M ${rootX - 13} ${rootY - 32} L ${rootX + 13} ${rootY - 32} L ${rootX} ${rootY - 12} Z`}
            fill="none"
            stroke={antennaColor}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </g>

        {/* ノード */}
        {MORSE_TREE_NODES.map(renderNode)}
      </svg>

      {/* 状態表示（固定高さ） */}
      <div className="h-5 text-[11px] sm:text-xs font-mono flex items-center gap-2">
        {isNoMatch ? (
          <span className="text-rose-400">{t.morseTree.noMatch}</span>
        ) : currentNode ? (
          <span className={committed ? 'text-cyan-300' : 'text-emerald-400'}>
            {committed ? t.morseTree.committed : t.morseTree.current}: {currentNode.char} ({morseToDotsAndDashes(currentNode.code)})
          </span>
        ) : (
          <span className="text-slate-500">{onSelect ? t.morseTree.tapHint : t.morseTree.idleHint}</span>
        )}
      </div>
    </div>
  );
};
