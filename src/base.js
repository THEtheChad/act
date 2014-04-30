function isArray(obj) { return (!!obj) && (obj.constructor === Array)  }
function isObject(obj){ return (!!obj) && (obj.constructor === Object) }
function isString(obj){ return (typeof obj == 'string') }
function isNumber(obj){ return (typeof obj == 'number') }

function toArray(obj){
	if( isArray(obj) ) return obj;
	return [obj];
}

function slice(arr, idx){
	return Array.prototype.slice.call(arr, idx || 0);
}

function extend(target){
	var source, i, k;

	i = arguments.length;

	while(i-- > 1){
		source = arguments[i];

		for(k in source) target[k] = source[k];
	}

	return target;
}