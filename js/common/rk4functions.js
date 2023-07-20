import { simData } from './simData.js';

export function updateVals(dt, velocity, angle, omega, radius, g, k, equations, useEval){
    //console.log(omega)
      const N = 2;
      let r = radius;
      let i;
      let j;
      let h = dt; //this will be delta T between animation
      let t = 0.0;
      let y = [angle,velocity];
      let ynew = [];
      ynew = rk4(y,N,t,h,ynew,omega, r,g, k, equations, useEval);
      y[0] = ynew[0];
      y[1] = ynew[1];
      y[0] = y[0]%(2*Math.PI);
      if (y[0] < 0){
        y[0] = 2*Math.PI - Math.abs(y[0])
      }
      return y;
    }


 export function getGraphData(dt, velocity, angle, omega, radius, g, k, equations, useEval, graphLen, graphVals, time, wrap){
    
    const N = 2;
      let r = radius;
      let i;
      let j;
      let h = dt; 
      let t = time;
      let y = [angle,velocity];
      let ynew = [angle,velocity];
      // let graphVals = new simData(dt);
    //console.log(t + "<" + graphLen)
    while(t<graphLen){
        graphVals.insert(t,ynew[0],ynew[1]);
        //console.log(graphVals.data.length + "" + t + "<" + graphLen)
        
        //console.log([t,y[0],y[1]]);
        ynew = rk4(y,N,t,h,ynew,omega, r,g,k, equations, useEval);
        y[0] = ynew[0];
        y[1] = ynew[1];

        if (wrap){
          y[0] = y[0]%(2*Math.PI);
          if (y[0] < 0){
            y[0] = 2*Math.PI - Math.abs(y[0])
          }
        }
        

    //console.log(y[0]);
        t = t + h;
        //console.log(ynew);
        
    }
    return graphVals;
}
  
  function derivsEval(t,y,dydt,omega,r,g,k, equations){
    try{
      const thetadot = globalThis.window.evaluatex(equations.thetadot, {k:k,r:r,g:g,o:omega}, {latex:true});
      dydt[0]= thetadot({v:y[1],t:y[0]});
      } catch (err){
        //console.log(err);
        document.getElementById("error-output").innerHTML="[BAD OR NO EQUATION INPUTED]";
      }
    
    try{
      const velocitydot = globalThis.window.evaluatex(equations.velocitydot, {k:k,r:r,g:g,o:omega}, {latex:true});
      dydt[1]= velocitydot({v:y[1],t:y[0]});
    } catch(err){
      document.getElementById("error-output").innerHTML="[BAD OR NO EQUATION INPUTED]";
    }
    
  

      return dydt;
  }

  function derivs(t,y,dydt,omega,r,g,k){
    //console.log(`${y} - ${dydt} - ${omega} - ${r} - ${g} - ${k}`);
      dydt[0] = y[1]/r;
      dydt[1] = r*Math.sin(y[0])*(Math.pow(omega, 2)*Math.cos(y[0])-g/r)-k*y[1];


      return dydt;
  }
  
  function rk4(y,N,x,h,ynew,omega, radius,g,k, equations, useEval){
      let h6;
      let hh;
      let xh;
      let dym = [];
      let dyt = [];
      let yt = [];
      let dydx = [];
      let index;
      hh = h*0.5;
      h6 = h/6.0;
      xh=x+hh;
      dydx = useEval ?  derivsEval(x,y,dydx,omega, radius,g,k, equations) : derivs(x,y,dydx,omega, radius,g,k) ;
      
      for (index = 0; index <= N; index++){
          yt[index] = y[index]+hh*dydx[index];
      }
      dyt = useEval ?  derivsEval(xh,yt,dyt,omega, radius,g,k, equations) : derivs(xh,yt,dyt,omega, radius,g,k) ;
      
      for (index = 0; index <= N; index++){
          yt[index] = y[index]+hh*dyt[index];
      }
      dym = useEval ?  derivsEval(xh,yt,dym,omega, radius,g,k, equations) : derivs(xh,yt,dym,omega, radius,g,k);
      
      for (index = 0; index <= N; index++){
          yt[index] = y[index]+h*dym[index];
          dym[index] = dyt[index]+dym[index];
      }
      dyt = useEval ? derivsEval(x+h,yt,dyt,omega, radius,g,k, equations) : derivs(x+h,yt,dyt,omega, radius,g,k) ;
      
      for (index = 0; index <= N; index++){
          ynew[index]=y[index]+h6*(dydx[index]+dyt[index]+2.0*dym[index]);
      }
      for (index = 0; index <= N; index++){
          if (ynew[index] instanceof Number){
              ynew[index] = ynew[index].toFixed(4);
          }
      }
      //console.log(dydx);
      return ynew;
  }