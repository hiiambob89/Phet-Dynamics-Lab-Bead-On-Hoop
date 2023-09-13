// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Kaden Hart
 */

import beadOnHoop from '../../beadOnHoop.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TModel from '../../../../joist/js/TModel.js';
import Property from '../../../../axon/js/Property.js';
import BeadOnHoopConstants from '../../common/BeadOnHoopConstants.js';
import { simData } from '../../../../bead-on-hoop/js/common/simData.js';
import {updateVals, getGraphData} from '../../common/rk4functions.js'
// import data from '../../../configurations/bead_var.json' assert { type: 'json' };
type SelfOptions = {
  //TODO add options that are specific to BeadOnHoopModel here
  configFile: String;
};

type BeadOnHoopModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BeadOnHoopModel implements TModel {
  paramList: {[id: string]: any};
  // public angle: Property<number>;
  public radiusProp: Property<number>;
  public gravityProp: Property<number>;
  public frictionProp: Property<number>;
  public omegaProp: Property<number>;
  public omegaRadsProp: Property<number>;
  public thetaProp: Property<number>;
  public velocityProp: Property<number>;
  public simSpeedProp: Property<number>;
  public graphData: simData;
  public ballsCords: number[];
  public prevCords: number[][];
  public project: boolean;
  public trailLen: number;
  public timer: number;
  public rotation: number;
  public graphLen: number;
  public originalLen: number;
  public graphUpdateInterval: number;

  public angle: number; 
  public velocity: number;
  public omega: number; // making this because due to pregenerating data the changes wont show up until datachunk is exhausted and new data generated, will have to rework for it to work like that
  public radius: number;
  public gravity: number;
  public friction: number;
  
  
  // public 
  // public graphLen: Property<number>;

  // public velocity: Number;

  public constructor( providedOptions: BeadOnHoopModelOptions ) {
    //TODO
    this.paramList = {};
    for (const obj of BeadOnHoopConstants.BEAD_CONFIG) {
      
      this.paramList[obj.id] = obj;
      // this.paramList[obj.id].prop = new Property(Number(obj.val));
    }
    // this.angle = new Property(Number(this.paramList["theta"].val))
    this.radiusProp = new Property(Number(this.paramList["radius"].val))
    this.gravityProp = new Property(Number(this.paramList["gravity"].val))
    this.frictionProp = new Property(Number(this.paramList["friction"].val))
    this.omegaProp = new Property(Number(this.paramList["omega"].val))
    this.omegaRadsProp = new Property(Number(this.paramList["omegaRads"].val))
    this.thetaProp = new Property(Number(this.paramList["theta"].val))
    this.velocityProp = new Property(Number(this.paramList["velocity"].val))
    this.simSpeedProp = new Property(Number(this.paramList["simSpeed"].val))
    
    // this.graphLen = new Property(Number(this.paramList["graphlen"].val))
    
    this.omegaProp.link(((val)=>{this.omegaRadsProp.value = val * Math.PI/180}))
    this.omegaRadsProp.link(((val)=>{this.omegaProp.value = val / Math.PI *180}))
    this.graphUpdateInterval = .001;
    this.angle = this.thetaProp.value;
    this.velocity = this.velocityProp.value;
    this.omega = this.omegaProp.value;
    this.radius = this.radiusProp.value;
    this.gravity = this.gravityProp.value;
    this.friction = this.frictionProp.value;
    this.graphData = new simData(this.graphUpdateInterval)
    this.ballsCords = [];
    this.prevCords = [];
    this.trailLen = 20;
    this.graphLen = 5;
    this.timer = 0;
    this.project = false;
    for (let i = 0; i < this.trailLen; i++){
      this.ballsCords.push(0)
      this.prevCords.push([0])
    }
    this.graphData = getGraphData(this.graphUpdateInterval, this.velocity, this.angle*Math.PI/180, this.omega, this.radius, this.gravity, this.friction, {}, false, this.graphLen, this.graphData, this.timer, this.project);
    this.rotation = 0;
    this.originalLen = this.graphLen;
  }
  update(val: number){
    console.log(val) ;
    
  }
  /**
   * Resets the model.
   */
  public reset(): void {
    this.angle = this.thetaProp.value;
    this.velocity = this.velocityProp.value;
    this.omega = this.omegaProp.value;
    this.radius = this.radiusProp.value;
    this.gravity = this.gravityProp.value;
    this.friction = this.frictionProp.value;
    this.graphData = new simData(this.graphUpdateInterval)
    this.ballsCords = [];
    this.prevCords = [];
    this.trailLen = 20;
    this.graphLen = 5;
    this.timer = 0;
    this.project = false;
    for (let i = 0; i < this.trailLen; i++){
      this.ballsCords.push(0)
      this.prevCords.push([0])
    }
    this.graphData = getGraphData(this.graphUpdateInterval, this.velocity, this.angle*Math.PI/180, this.omega, this.radius, this.gravity, this.friction, {}, false, this.graphLen, this.graphData, this.timer, this.project);
    this.rotation = 0;
    this.originalLen = this.graphLen;
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.timer += dt*this.simSpeedProp.value;
    this.angle = this.graphData.getTheta(this.timer);
    this.angle = this.angle%(2*Math.PI);
      if (this.angle < 0){
        this.angle = 2*Math.PI - Math.abs(this.angle)
      }
    // console.log(this.angle *180/Math.PI)
    // console.log(this.angle)
    this.velocity = this.graphData.getVelocity(this.timer);

    this.rotation += this.omega*dt*this.simSpeedProp.value*0.0174533;
    if(this.timer < this.graphLen){
      let ballAngle = this.graphData.getTheta(this.timer);
      let ballVelocity = this.graphData.getVelocity(this.timer);
      // updateBallGraph(timer, ballAngle, ballVelocity, graphLen, thetaGraph, velocityGraph, graphData);
    } else {
      this.graphLen = this.graphLen + this.originalLen; 
      getGraphData(this.graphUpdateInterval, this.velocity, this.angle, this.omega, this.radius, this.gravity, this.friction, {}, false, this.graphLen, this.graphData, this.timer, this.project);
      //console.log(graphData.data.length);
      // if (thetaDivId === "variableSim-theta"){
      //   document.getElementById("variableSim-theta").innerHTML = "";
      //   document.getElementById("variableSim-velocity").innerHTML = "";
      //   thetaGraph = drawTheta(graphData, graphLen, thetaDivId, "test");
      //   velocityGraph = drawVelocity(graphData, graphLen, velocityDivId, "test");
      // } else{
      //   document.getElementById("staticSim-theta").innerHTML = "";
      //   document.getElementById("staticSim-velocity").innerHTML = "";
      //   thetaGraph = drawTheta(graphData, graphLen, thetaDivId, "reference");
      //   velocityGraph = drawVelocity(graphData, graphLen, velocityDivId, "reference");
      // }
      //updateGraphData(graphLen, thetaGraph, velocityGraph, graphData);
      // updateBallGraph(timer, angle, velocity, graphLen, thetaGraph, velocityGraph, graphData);
    }
    
 

    //takes care of ball trail, and whether or not its projected on the hoop
    if (this.project){
      this.ballsCords.push(this.angle);
      this.ballsCords.shift();
    }
    let cords = getBallPos(this.angle+3*Math.PI/2, 100);
    let xyz = {x:cords[0]*Math.cos(this.rotation), y: cords[1], z: -cords[0]*Math.sin(this.rotation)};
    // ball.position.set(xyz.x,xyz.y,xyz.z);
    this.prevCords.push([xyz.x,xyz.y,xyz.z]);
    this.prevCords.shift();
    for (let i = 0; i < this.trailLen; i++) {
      if (this.prevCords[i].toString() != [0].toString()){
        if (this.project){
          let tempCord = getBallPos(this.ballsCords[i]+3*Math.PI/2, 100);
          // balls[i].position.set(tempCord[0]*Math.cos(hoop.rotation.y),  tempCord[1],  -tempCord[0]*Math.sin(hoop.rotation.y))
        } else {
          // balls[i].position.set(prevCords[i][0],prevCords[i][1],prevCords[i][2])
      }
    }
    }

  }
}
function getBallPos(angle: number,radius: number){
  let x = radius*Math.cos(angle);
  let y = radius*Math.sin(angle);
return [x,y];
}

beadOnHoop.register( 'BeadOnHoopModel', BeadOnHoopModel );