function namedFunction() { 

}
const b = function (a) { return a };
let c = (a:number, b:number):null => null;

export function plus(a:number=45, b?:number):number { 
    (namedFunction());
    (c(2,3));

    (namedFunction())
    (c(2,3))
    return a + b;
}

export default (function():void { })();