import { default as formatNumber } from "format-number";

const _formatCurrency = formatNumber({ round: 2, padRight: 2 });

function formatCurrency(number) {
  return _formatCurrency(number);
}

export { formatCurrency };
