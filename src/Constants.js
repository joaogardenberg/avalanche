export const COLUMNS         = 6;
export const ROWS            = 12;

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
