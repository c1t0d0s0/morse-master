/**
 * 電鍵（長押しする操作面）用の ref コールバック。
 *
 * スマホで長押しすると、CSS の user-select / -webkit-touch-callout だけでは
 * iOS Safari などでテキスト選択モード（「選択」「コピー」メニュー・拡大鏡）が
 * 起動してしまうことがある。touchstart の既定動作を非 passive リスナーで
 * キャンセルすると長押しジェスチャー自体が始まらなくなる。
 * （React の onTouchStart は passive なので preventDefault が効かない）
 *
 * Pointer Events（pointerdown / pointerup）は touchstart をキャンセルしても
 * 発火するため、打鍵処理はそのまま動作する。
 *
 * React 19 の ref コールバックのクリーンアップ関数でリスナーを解除する。
 * モジュールレベルの安定した関数なので再レンダーごとに付け直されない。
 */
export const preventTouchSelection = (el: HTMLElement | null): (() => void) | undefined => {
  if (!el) return undefined;

  const cancel = (e: Event) => {
    if (e.cancelable) e.preventDefault();
  };
  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
  };

  el.addEventListener('touchstart', cancel, { passive: false });
  el.addEventListener('contextmenu', cancel);
  el.addEventListener('selectstart', cancel);
  el.addEventListener('pointerdown', clearSelection);

  return () => {
    el.removeEventListener('touchstart', cancel);
    el.removeEventListener('contextmenu', cancel);
    el.removeEventListener('selectstart', cancel);
    el.removeEventListener('pointerdown', clearSelection);
  };
};
