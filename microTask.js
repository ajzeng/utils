/**
 * 微任务调度器
 */

const microTask = (function() {
	let timerFn;
	if (typeof MutationObserver !== 'undefined') {
		let counter = 1;
		const textNode = document.createTextNode(counter);
		let microTaskList = [];
		let running = false;
		const cb = () => {
      const copyList = microTaskList.slice(0);
      microTaskList = [];
			running = false;
			while(copyList.length) {
				const microT = copyList.shift();
				microT();
			}
		};
		const observer = new MutationObserver(cb);
		observer.observe(textNode, { characterData: true });
		timerFn = (fn) => {
			microTaskList.push(fn);
      if (running) {
        return;
      }
      running = true;
			counter = (counter + 1) % 2;
			textNode.data = counter;
		}
	} else {
		const context = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
		timerFn = context.setImmediate || setTimeout;
	}
	return (fn) => {
		timerFn(fn);
	};
})();

// 使用方法

console.log('11');
setTimeout(() => {
  console.log('22');
});
microTask(() => {
  console.log('33');
  microTask(() => {
    console.log('44');
  })
});

microTask(() => {
  console.log('55');
});

console.log('66');

// 输出结果： 11, 66, 33, 55, 44, 22