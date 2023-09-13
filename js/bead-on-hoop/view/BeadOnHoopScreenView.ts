// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Kaden Hart
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import BeadOnHoopConstants from '../../common/BeadOnHoopConstants.js';
import beadOnHoop from '../../beadOnHoop.js';
import BeadOnHoopModel from '../model/BeadOnHoopModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { AlignBox, DOM, FlowBox, HBox, HSeparator, RichText, VBox } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Range from '../../../../dot/js/Range.js';
import {Text} from '../../../../scenery/js/imports.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import { BoxGeometry, Mesh, MeshBasicMaterial, Group, Scene } from '../../../../chipper/node_modules/@types/three/index.js';
import ThreeIsometricNode from '../../../../mobius/js/ThreeIsometricNode.js';
import ThreeUtils from '../../../../mobius/js/ThreeUtils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { animatedPanZoomSingleton } from '../../../../scenery/js/imports.js';
import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import NodeTexture from '../../../../mobius/js/NodeTexture.js';
import TextureQuad from '../../../../mobius/js/TextureQuad.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
// import * as THREE from '../../../../chipper/node_modules/@types/three/index.d.js';
// import * as THREE from 'THREE';
// import * as MathQuill  from '../../common/mathquill.min.js';

type SelfOptions = {
 //TODO add options that are specific to BeadOnHoopScreenView here
};

type BeadOnHoopScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class BeadOnHoopScreenView extends ScreenView {
  
  public readonly sceneNode!: ThreeIsometricNode;
  private readonly cubeMesh!: THREE.Mesh;
  private readonly hoop!: THREE.Mesh;
  private readonly ball!: THREE.Mesh;
  private omega: Property<number>;
  private model: BeadOnHoopModel;
  public constructor( model: BeadOnHoopModel, providedOptions: BeadOnHoopScreenViewOptions ) {

    const options = optionize<BeadOnHoopScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - BeadOnHoopConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - BeadOnHoopConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
    
    var sliderVBOXchildren = [
      new HBox({children: [new phet.scenery.Text("radius", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.radiusProp, new Range(0.1,Number(100))), new RichText(new DerivedProperty([model.radiusProp], (value) => {return String(Number(value).toFixed(2))}))]}),
      new HBox({children: [new phet.scenery.Text("gravity", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.gravityProp, new Range(0,Number(100))), new RichText(new DerivedProperty([model.gravityProp], (value) => {return String(Number(value).toFixed(2))}))]}),
      new HBox({children: [new phet.scenery.Text("friction", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.frictionProp, new Range(0,Number(100))), new RichText(new DerivedProperty([model.frictionProp], (value) => {return String(Number(value).toFixed(2))}))]}),
      new HBox({children: [new phet.scenery.Text("omega", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.omegaProp, new Range(0,Number(5000))), new RichText(new DerivedProperty([model.omegaProp], (value) => {return String(Number(value).toFixed(2))}))]}),
      new HBox({children: [new phet.scenery.Text("omegaRads", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.omegaRadsProp, new Range(0,Number(90))), new RichText(new DerivedProperty([model.omegaRadsProp], (value) => {return String(Number(value).toFixed(2))}))]}),
      new HBox({children: [new phet.scenery.Text("theta", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.thetaProp, new Range(0,Number(360))), new RichText(new DerivedProperty([model.thetaProp], (value) => {return String(Number(value).toFixed(2))}))]}),
      new HBox({children: [new phet.scenery.Text("velocity", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.velocityProp, new Range(0,Number(10))), new RichText(new DerivedProperty([model.velocityProp], (value) => {return String(Number(value).toFixed(2))}))]}),
      new HBox({children: [new phet.scenery.Text("simSpeed", {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(model.simSpeedProp, new Range(0,Number(3))), new RichText(new DerivedProperty([model.simSpeedProp], (value) => {return String(Number(value).toFixed(2))}))]}),

    ];
    var sliderNameVBOXchildren = [
    ];
    // console.log(model.paramList)
    // for (var [objKey, objVal] of Object.entries(model.paramList) as any){
    //   console.log(objKey)
    //   if (objVal.type != "checkbox"){
    //     const paramGroup = new HBox({children: [new phet.scenery.Text(objVal.id, {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(objVal.prop, new Range(Number(objVal.min),Number(objVal.max))), new RichText(new DerivedProperty([objVal.prop], (value) => {return String(Number(value).toFixed(2))}))]})
    //     sliderVBOXchildren.push(paramGroup)
    //   }
    // }
    this.model = model;
    this.omega = model.omegaProp
    this.rotation = 0;
    // for (var [objKey, objVal] of Object.entries(model.paramList) as any){
    //   console.log(objKey)
    //   if (objVal.type != "checkbox"){
    //     sliderNameVBOXchildren.push(new phet.scenery.Text(objVal.id, {fontSize: 20}));
    //     sliderVBOXchildren.push(new HSlider(objVal.prop, new Range(Number(objVal.min),Number(objVal.max))))
    //   }
    // }
    // const paramGroup = new HBox({children: [new phet.scenery.Text(objVal.id, {fontSize: 20}), new HSlider(objVal.prop, new Range(Number(objVal.min),Number(objVal.max)))]})
    const sliders = new VBox({children: sliderVBOXchildren, right: this.layoutBounds.maxX - BeadOnHoopConstants.SCREEN_VIEW_X_MARGIN, bottom: this.layoutBounds.maxY - BeadOnHoopConstants.SCREEN_VIEW_Y_MARGIN})
    // const names = new VBox({children: sliderNameVBOXchildren, right: this.layoutBounds.maxX - BeadOnHoopConstants.SCREEN_VIEW_X_MARGIN, bottom: this.layoutBounds.maxY - BeadOnHoopConstants.SCREEN_VIEW_Y_MARGIN})
    // const paramGroup = new AlignBox(new HBox({children: [names,sliders]}), {
    //   alignBoundsProperty: this.visibleBoundsProperty,
    //   xAlign: 'left',
    //   yAlign: 'bottom',
    //   margin: 10
    // } )
    this.addChild(sliders);
    

    // const simGroup = new THREE.BoxGeometry;
  
    if ( !ThreeUtils.isWebGLEnabled() ) {
      ThreeUtils.showWebGLWarning( this );
      this.enabled = false;
      return;
    }

    // Used to display the 3D view
    this.sceneNode = new ThreeIsometricNode( this.layoutBounds, {
      parentMatrixProperty: animatedPanZoomSingleton.listener!.matrixProperty,
      cameraPosition: new Vector3( 0, 0, 2 )
    } );
    this.addChild( this.sceneNode );

    // Camera settings
    this.sceneNode.stage.threeCamera.zoom = 1;
    this.sceneNode.stage.threeCamera.updateProjectionMatrix();
    this.sceneNode.stage.threeCamera.position.set(0,0,8)
    // this.sceneNode.stage.threeCamera.up = new THREE.Vector3( 0, 0, 0 );
    // this.sceneNode.stage.threeCamera.lookAt( ThreeUtils.vectorToThree( Vector3.ZERO ) );

    // Lights
    const ambientLight = new THREE.AmbientLight( 0x333333 );
    this.sceneNode.stage.threeScene.add( ambientLight );
    const sunLight = new THREE.DirectionalLight( 0xffffff, 1 );
    sunLight.position.set( -1, 1.5, 0.8 );
    this.sceneNode.stage.threeScene.add( sunLight );
    const moonLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
    moonLight.position.set( 2.0, -1.0, 1.0 );
    this.sceneNode.stage.threeScene.add( moonLight );

    const cubeGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    const cubeMaterial = new THREE.MeshLambertMaterial( {
      color: 0xFF0000
    } );

    // Create a mesh with the geometry and material
    this.cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
    //this.sceneNode.stage.threeScene.add( this.cubeMesh );
    // const lightFront = new THREE.PointLight( 0xffffff, 2, 0 );
    // lightFront.position.set( 0, 0, 10000 );
    // this.sceneNode.stage.threeScene.add( lightFront );
    const geometryHoop = new THREE.TorusGeometry(1.5,.07,16,50, 2*Math.PI);
    const materialHoop = new THREE.MeshLambertMaterial({color: 0x44aa88}); 
    this.hoop = new THREE.Mesh(geometryHoop, materialHoop);
    this.hoop.position.set(0,0,0);
    this.sceneNode.stage.threeScene.add( this.hoop );
    const geometryBall = new THREE.SphereGeometry( .12, 8,8 );
    const materialBall = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    this.ball = new THREE.Mesh( geometryBall, materialBall );
    this.ball.position.set(1.5,0,0);
    this.sceneNode.stage.threeScene.add( this.ball );
    // Toss some Node content into the 3D scene. Would call update() on the NodeTexture whenever it needs updates.
    const exampleNode = new Keypad( Keypad.PositiveIntegerLayout, {
      scale: 3,
      left: 1,
      top: 1
    } );
    const size = Math.ceil( Math.max( exampleNode.width, exampleNode.height ) ) + 2;
    const label = new TextureQuad( new NodeTexture( exampleNode, size, size ), 0.2, 0.2 );
    label.position.copy( ThreeUtils.vectorToThree( new Vector3( 0, 0, 0.26 ) ) );

    this.cubeMesh.add( label );
    const span = document.createElement("span");
    span.setAttribute("id", "math-span");
    var MQ = globalThis.window.MathQuill.getInterface(2);
    var mathField = MQ.MathField(span, {
      spaceBehavesLikeTab: true, // configurable
      handlers: {
        edit: function() { // useful event handlers
          // latexSpan.textContent = mathField.latex(); // simple API
        }
      }
    });
    const spanDOM = new DOM(span);
    this.addChild(spanDOM)
    // var MQ = MathQuill.getInterface(2);
  }

  public override layout( viewBounds: Bounds2 ): void {
    super.layout( viewBounds );

    // If the simulation was not able to load for WebGL, bail out
    if ( !this.sceneNode ) {
      return;
    }

    this.sceneNode.layout( viewBounds.width, viewBounds.height );

    // We need to do an initial render for certain layout-based code to work
    this.sceneNode.render( undefined );
  }

  /**
   * Steps forward in time.
   */
  public reset(): void {
    this.ball.position.set(0,0,0)
    this.sceneNode.render( undefined );
  }
  public override step( dt: number): void {
    // If the simulation was not able to load for WebGL, bail out
    if ( !this.sceneNode ) {
      return;
    }
    // this.cubeMesh.rotateY( dt*this.omega.value);
    // console.log(dt*this.omega.value)
    // this.hoop.rotation.y +=dt*this.omega.value*0.0174533
    this.hoop.rotation.y = this.model.rotation;
    // this.hoop.rotateY( dt*this.omega.value);

    const cords = this.getBallPos(3*Math.PI/2+this.model.angle,1.5)
    this.ball.position.set(cords[0]*Math.cos(this.model.rotation ),  cords[1],  -cords[0]*Math.sin(this.model.rotation));
    // this.ball.position.set(this.model.prevCords[0][0],this.model.prevCords[0][1],this.model.prevCords[0][2]);
    // this.ball.rotateOnAxis(new THREE.Vector3(1,0,1),dt*this.omega.value)
    
    this.sceneNode.render( undefined );
    // console.log((dt*this.omega.value)% ( 2 * Math.PI ))
    // console.log(this.cubeMesh.rotation.y)
  }
  getBallPos(angle: number,radius: number){
    let x = radius*Math.cos(angle);
    let y = radius*Math.sin(angle);
  return [x,y];
  }
}

beadOnHoop.register( 'BeadOnHoopScreenView', BeadOnHoopScreenView );