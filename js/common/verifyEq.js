
export function verifyEq( element,model ){
    let omega = model.omega
    let g = model.gravity
    let k  = model.friction
    let angle =  model.angle
    let velocity = model.velocity
    let radius = model.radius
    let result;
    let result2;
    console.log(model.velocityEQ)
    try{
      const eq = globalThis.window.evaluatex(model.velocityEQ, {k:k,r:radius,g:g,o:omega}, {latex:true});
      result = eq({v:velocity,t:angle});
      const eq2 = globalThis.window.evaluatex(model.thetaEQ, {k:k,r:radius,g:g,o:omega}, {latex:true});
      result2 = eq2({v:velocity,t:angle});

      if (Object.hasOwn(element, 'domElement')) {
        element.domElement.classList.remove('error');
        console.log("NO ERROR")
      } else{
        element.classList.remove('error');
        console.log("NO ERROR")

      }
      

    } catch (err){
      console.log(err)
      // element.innerHTML="[BAD OR NO EQUATION INPUTED]";
      // element.text = "[BAD OR NO EQUATION INPUTED]";
      if (Object.hasOwn(element, 'domElement')){
        console.log("ERROR")
        element.domElement.classList.add('error');
      } else{
        element.classList.add('error');
      }

      return false;
    }
    return true;
}

