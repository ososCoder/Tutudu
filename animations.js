'use strict';

const highLi = document.getElementsByClassName('high');
const mediumLi = document.getElementsByClassName('medium');
const lowLi = document.getElementsByClassName('low');

const randomNum = () => {
  return Math.random() * (3 - 1) + 1;
};

function move() {
  for (const li of highLi) {
    gsap.fromTo(
      li,
      { x: -2000 },
      { x: 0, duration: randomNum(), ease: 'back.out(1.7)' }
    );
  }

  for (const li of mediumLi) {
    gsap.fromTo(
      li,
      { x: 2000 },
      { x: 0, duration: randomNum(), ease: 'back.out(1.7)' }
    );
  }

  for (const li of lowLi) {
    gsap.fromTo(
      li,
      { x: 2000 },
      { x: 0, duration: randomNum(), ease: 'back.out(1.7)' }
    );
  }
}

export { move };
