export const COLUMNS                = 6;
export const ROWS                   = 12;
export const PLACE_BLOCK_DELAY      = 1000;
export const PLACE_BLOCK_FULL_DELAY = 3000;

export const getColor = n => {
  switch(n) {
    case 1:
      return 'green';
    case 2:
      return 'blue';
    case 3:
      return 'yellow';
    case 4:
      return 'purple';
    default:
      return 'red';
  }
}
