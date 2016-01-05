/**
 * Created by donkey on 2014/11/26.
 */

/*Array.prototype = {
 constructor: this,
 indexOf:function (val) { //获取index
 for (var i = 0; i < this.length; i++) {
 if (this[i] == val) return i;
 }
 return -1;
 },
 remove:function (val) { //删除指定内容
 var index = this.indexOf(val);
 if (index > -1) {
 this.splice(index, 1);
 }
 }
 };*/


/* -------------------------------------------------
 * 功能 : 制定数组扩展功能
 * */
define(function () {
	if (typeof Array.prototype.indexOf != "function") {  // for ie6-8
		Array.prototype.indexOf = function (val) {
			for(var i = 0; i < this.length; i++) {
				if(this[i] == val) return i;
			}
			return -1;
		};
	}

	if (typeof Array.prototype.forEach != "function") { // for ie6-8
		Array.prototype.forEach = function (fn, context) {
			for (var k = 0, length = this.length; k < length; k++) {
				if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
					fn.call(context, this[k], k, this);
				}
			}
		};
	}
	/*功能 : 删除数组制定内容
	示例 : var emp = ['abs','dsf','sdf','fd']  --> emp.remove('fd');   -->   ['abs','dsf','sdf']*/
	Array.prototype.arrRemove = function (val) {
		var index = this.indexOf(val);
		if(index != -1) {
			this.splice(index,1);
		}
		return this;
	};
});


/*-----------------------------------------------------------*/

