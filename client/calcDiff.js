
//compare changes
function diffCalc(a, b, cmp, atomicChanges = false) {
	// Set the comparator function.
	cmp = cmp || function (a, b) {
		return a === b;
	};

	if (!Array.isArray(a)) {
		a = Array.prototype.slice.call(a);
	}

	if (!Array.isArray(b)) {
		b = Array.prototype.slice.call(b);
	}

	// Get changes within range.
	const changeIndexes = findChangeBoundaryIndexes(a, b, cmp);

	return atomicChanges ? changeIndexesToAtomicChanges(changeIndexes, b.length) : changeIndexesToChanges(b, changeIndexes);
}

function findChangeBoundaryIndexes(arr1, arr2, cmp) {

	const firstIndex = findFirstDifferenceIndex(arr1, arr2, cmp);

	if (firstIndex === -1) {
		return { firstIndex: -1, lastIndexOld: -1, lastIndexNew: -1 };
	}

	// Eliminate common changes
	const oldArrayReversed = cutAndReverse(arr1, firstIndex);
	const newArrayReversed = cutAndReverse(arr2, firstIndex);

	
	
	const lastIndex = findFirstDifferenceIndex(oldArrayReversed, newArrayReversed, cmp);

	const lastIndexOld = arr1.length - lastIndex;
	const lastIndexNew = arr2.length - lastIndex;

	return { firstIndex, lastIndexOld, lastIndexNew };
}


function findFirstDifferenceIndex(arr1, arr2, cmp) {
	for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
		if (arr1[i] === undefined || arr2[i] === undefined || !cmp(arr1[i], arr2[i])) {
			return i;
		}
	}

	return -1; // Return -1 if arrays are equal.
}

function cutAndReverse(arr, howMany) {
	return arr.slice(howMany).reverse();
}

// Generates changes array based on change indexes from `findChangeBoundaryIndexes` function. This function will
function changeIndexesToChanges(newArray, changeIndexes) {
	const result = [];
	const { firstIndex, lastIndexOld, lastIndexNew } = changeIndexes;
	if (lastIndexNew - firstIndex > 0) {
		result.push({
			index: firstIndex,
			type: 'insert',
			values: newArray.slice(firstIndex, lastIndexNew)
		});
	}

	if (lastIndexOld - firstIndex > 0) {
		result.push({
			index: firstIndex + (lastIndexNew - firstIndex), // Increase index of what was inserted.
			type: 'delete',
			howMany: lastIndexOld - firstIndex
		});
	}

	return result;
}


function changeIndexesToAtomicChanges(changeIndexes, newLength) {
	const { firstIndex, lastIndexOld, lastIndexNew } = changeIndexes;


	if (firstIndex === -1) {
		return Array(newLength).fill('equal');
	}

	let result = [];
	if (firstIndex > 0) {
		result = result.concat(Array(firstIndex).fill('equal'));
	}

	if (lastIndexNew - firstIndex > 0) {
		result = result.concat(Array(lastIndexNew - firstIndex).fill('insert'));
	}

	if (lastIndexOld - firstIndex > 0) {
		result = result.concat(Array(lastIndexOld - firstIndex).fill('delete'));
	}

	if (lastIndexNew < newLength) {
		result = result.concat(Array(newLength - lastIndexNew).fill('equal'));
	}

	return result;
}

function diff(a, b, cmp) {

	cmp = cmp || function (a, b) {
		return a === b;
	};

	const aLength = a.length;
	const bLength = b.length;

	if (aLength > 200 || bLength > 200 || aLength + bLength > 300) {
		return diffCalc(a, b, cmp, true);
	}


	let _insert, _delete;


	if (bLength < aLength) {
		const tmp = a;

		a = b;
		b = tmp;

		_insert = 'delete';
		_delete = 'insert';
	} else {
		_insert = 'insert';
		_delete = 'delete';
	}

	const m = a.length;
	const n = b.length;
	const delta = n - m;


	const es = {};

	const fp = {};

	function diagonalManipulation(k) {
		
		const y1 = (fp[k - 1] !== undefined ? fp[k - 1] : -1) + 1;

		const y2 = fp[k + 1] !== undefined ? fp[k + 1] : -1;

		const dir = y1 > y2 ? -1 : 1;


		if (es[k + dir]) {
			es[k] = es[k + dir].slice(0);
		}


		if (!es[k]) {
			es[k] = [];
		}


		es[k].push(y1 > y2 ? _insert : _delete);


		let y = Math.max(y1, y2);
		let x = y - k;


		while (x < m && y < n && cmp(a[x], b[y])) {
			x++;
			y++;
			// Push no change action.
			es[k].push('equal');
		}

		return y;
	}

	let p = 0;
	let k;

	
	do {

		for (k = -p; k < delta; k++) {
			fp[k] = diagonalManipulation(k);
		}


		for (k = delta + p; k > delta; k--) {
			fp[k] = diagonalManipulation(k);
		}

		fp[delta] = diagonalManipulation(delta);
		//console.log(p);
		p++;
	} while (fp[delta] !== n);

	return es[delta].slice(1);
}

function diffToChanges(diff, output) {
	const changes = [];
	let index = 0;
	let lastOperation;

	diff.forEach(change => {
		if (change == 'equal') {
			pushLast();

			index++;
		} else if (change == 'insert') {
			if (isContinuationOf('insert')) {
				lastOperation.values.push(output[index]);
			} else {
				pushLast();

				lastOperation = {
					type: 'insert',
					index,
					values: [output[index]]
				};
			}

			index++;
		} else /* if ( change == 'delete' ) */ {
			if (isContinuationOf('delete')) {
				lastOperation.howMany++;
			} else {
				pushLast();

				lastOperation = {
					type: 'delete',
					index,
					howMany: 1
				};
			}
		}
	});

	pushLast();

	return changes;

	function pushLast() {
		if (lastOperation) {
			changes.push(lastOperation);
			lastOperation = null;
		}
	}

	function isContinuationOf(expected) {
		return lastOperation && lastOperation.type == expected;
	}
}
