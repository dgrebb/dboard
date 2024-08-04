export const pullToRefresh = function pullToRefresh(node: HTMLElement) {
  let touchstartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchstartY = e.touches[0].clientY;
  });

  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchstartY;
    if (touchDiff > 500 && window.scrollY === 0) {
      if (node) {
        node.classList.add('visible');
      }
      e.preventDefault();
    }
  });

  document.addEventListener('touchend', () => {
    if (node) {
      if (node.classList.contains('visible')) {
        node.classList.remove('visible');
        location.reload();
      }
    } else {
      return false;
    }
  });
};
