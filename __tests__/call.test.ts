import { run } from './helper';

describe('call', function () {
  it('method', function () {
    expect(
      run(
        `
class A{
_test1(_a){
console.log(_a)
}
_test2(arg1){
}
}
const a = new A();
a._test1();
`
      )
    ).toEqual(`
class A{
b(_a){
console.log(_a)
}
c(arg1){
}
}
const a = new A();
a.b();
`);
  });
});
