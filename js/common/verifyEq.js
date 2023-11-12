
export function verifyEq( element,model ){
    let omega = model.omega
    let g = model.gravity
    let k  = model.friction
    let angle =  model.angle
    let velocity = model.velocity
    let radius = model.radius
    let result;
    let result2;

    try{
      const eq = globalThis.window.evaluatex(model.velocityEQ, {k:k,r:radius,g:g,o:omega}, {latex:true});
      result = eq({v:velocity,t:angle});
      const eq2 = globalThis.window.evaluatex(model.thetaEQ, {k:k,r:radius,g:g,o:omega}, {latex:true});
      result2 = eq2({v:velocity,t:angle});
      element.setString("")

    } catch (err){
      console.log(err)
      // element.innerHTML="[BAD OR NO EQUATION INPUTED]";
      // element.text = "[BAD OR NO EQUATION INPUTED]";
      element.setString("[BAD OR NO EQUATION INPUTED]")

      console.log(model.thetaEQ)
      console.log(model.velocityEQ)
      return false;
    }
    return true;
}

