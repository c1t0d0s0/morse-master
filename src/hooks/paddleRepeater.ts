export type PaddleSymbol = '.' | '-';

export interface PaddleRepeaterOptions {
  /** 符号を1つ送出するとき（音・表示・バッファ追加は呼び出し側で行う） */
  onSymbol: (symbol: PaddleSymbol) => void;
  /** 現在の短点の長さ (ms) */
  getDotMs: () => number;
  /** 押下中の符号が変わったとき（ボタンの押下表示用） */
  onHeldChange?: (held: PaddleSymbol | null) => void;
}

/** 送出中に溜めておける先行入力の上限 */
const MAX_PENDING = 2;

/**
 * パドル入力（短点/長点キー）の連続打鍵スケジューラ（React 非依存）。
 *
 * - 押した瞬間に1符号を送出し、押し続けている間は
 *   「符号長 + 1短点分の間隔」ごとに同じ符号を繰り返す（トン・トン・トン / ツー・ツー・ツー）。
 * - 短点と長点を両方押している場合は、後から押した方を繰り返す。
 * - 符号の送出中に素早くタップした入力は取りこぼさず、次の符号として送出する。
 * - キーボードの OS オートリピートには依存しない（呼び出し側で e.repeat を無視すること）。
 */
export class PaddleRepeater {
  /** 押されている符号（押した順） */
  private held: PaddleSymbol[] = [];
  /** 送出中に押された符号（取りこぼし防止） */
  private pending: PaddleSymbol[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private options: PaddleRepeaterOptions) {}

  setOptions(options: PaddleRepeaterOptions) {
    this.options = options;
  }

  press(symbol: PaddleSymbol) {
    this.held = [...this.held.filter(s => s !== symbol), symbol];
    this.notifyHeld();

    if (this.timer === null) {
      this.tick();
    } else if (this.pending.length < MAX_PENDING) {
      this.pending.push(symbol);
    }
  }

  release(symbol: PaddleSymbol) {
    this.held = this.held.filter(s => s !== symbol);
    this.notifyHeld();
  }

  /** 全キーを離した扱いにする（モード切替・フォーカス喪失時など）。送出中の符号はそのまま終わる */
  releaseAll() {
    this.held = [];
    this.pending = [];
    this.notifyHeld();
  }

  dispose() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this.held = [];
    this.pending = [];
  }

  private tick = () => {
    const next = this.pending.shift() ?? this.held[this.held.length - 1];
    if (!next) {
      this.timer = null;
      return;
    }

    this.options.onSymbol(next);
    const dot = this.options.getDotMs();
    const elementWithGap = (next === '.' ? dot : dot * 3) + dot;
    this.timer = setTimeout(this.tick, elementWithGap);
  };

  private notifyHeld() {
    this.options.onHeldChange?.(this.held[this.held.length - 1] ?? null);
  }
}
