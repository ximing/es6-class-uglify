import { run } from './helper';

describe('case', function () {
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
}`
      )
    ).toEqual(`
class A{
a(_a){
console.log(_a)
}
b(arg1){
}
}`);
  });
  it('private method', function () {
    expect(
      run(
        `
class A{
private _test1(_a){
console.log(_a)
}
_test2(arg1){
}
}`
      )
    ).toEqual(`
class A{
private a(_a){
console.log(_a)
}
b(arg1){
}
}`);
  });
  it('minifies many class method declarations', () => {
    expect(
      run(
        'class A{_method1(){}_method2(){}_method3(){}_method4(){}_method5(){}_method6(){}_method7(){}_method8(){}_method9(){}_method10(){}_method11(){}_method12(){}_method13(){}_method14(){}_method15(){}_method16(){}_method17(){}_method18(){}_method19(){}_method20(){}_method21(){}_method22(){}_method23(){}_method24(){}_method25(){}_method26(){}_method27(){}_method28(){}_method29(){}_method30(){}_method31(){}_method32(){}_method33(){}_method34(){}_method35(){}_method36(){}_method37(){}_method38(){}_method39(){}_method40(){}_method41(){}_method42(){}_method43(){}_method44(){}_method45(){}_method46(){}_method47(){}_method48(){}_method49(){}_method50(){}_method51(){}_method52(){}_method53(){}_method54(){}_method55(){}_method56(){}_method57(){}_method58(){}_method59(){}_method60(){}_method61(){}_method62(){}_method63(){}_method64(){}_method65(){}_method66(){}_method67(){}_method68(){}_method69(){}_method70(){}_method71(){}_method72(){}_method73(){}_method74(){}_method75(){}_method76(){}_method77(){}_method78(){}_method79(){}_method80(){}_method81(){}_method82(){}_method83(){}_method84(){}_method85(){}_method86(){}_method87(){}_method88(){}_method89(){}_method90(){}_method91(){}_method92(){}_method93(){}_method94(){}_method95(){}_method96(){}_method97(){}_method98(){}_method99(){}_method100(){}_method101(){}_method102(){}_method103(){}_method104(){}_method105(){}}'
      )
    ).toEqual(
      'class A{a(){}b(){}c(){}d(){}e(){}f(){}g(){}h(){}i(){}j(){}k(){}l(){}m(){}n(){}o(){}p(){}q(){}r(){}s(){}t(){}u(){}v(){}w(){}x(){}y(){}z(){}B(){}C(){}D(){}E(){}F(){}G(){}H(){}I(){}J(){}K(){}L(){}M(){}N(){}O(){}P(){}Q(){}R(){}S(){}T(){}U(){}V(){}W(){}X(){}Y(){}Z(){}$(){}_(){}aa(){}ba(){}ca(){}da(){}ea(){}fa(){}ga(){}ha(){}ia(){}ja(){}ka(){}la(){}ma(){}na(){}oa(){}pa(){}qa(){}ra(){}sa(){}ta(){}ua(){}va(){}wa(){}xa(){}ya(){}za(){}Aa(){}Ba(){}Ca(){}Da(){}Ea(){}Fa(){}Ga(){}Ha(){}Ia(){}Ja(){}Ka(){}La(){}Ma(){}Na(){}Oa(){}Pa(){}Qa(){}Ra(){}Sa(){}Ta(){}Ua(){}Va(){}Wa(){}Xa(){}Ya(){}Za(){}}'
    );
  });
});
