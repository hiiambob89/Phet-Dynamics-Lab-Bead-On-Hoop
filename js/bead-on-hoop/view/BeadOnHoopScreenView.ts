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
import { AlignBox, DOM, FlowBox, HBox, HSeparator, Rectangle, RichText, VBox } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Range from '../../../../dot/js/Range.js';
import {Text} from '../../../../scenery/js/imports.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import { BoxGeometry, Mesh, MeshBasicMaterial, Group, Scene, Event, Object3D } from '../../../../chipper/node_modules/@types/three/index.js';
import ThreeIsometricNode from '../../../../mobius/js/ThreeIsometricNode.js';
import ThreeUtils from '../../../../mobius/js/ThreeUtils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { animatedPanZoomSingleton } from '../../../../scenery/js/imports.js';
import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import NodeTexture from '../../../../mobius/js/NodeTexture.js';
import TextureQuad from '../../../../mobius/js/TextureQuad.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TextInput from '../view/TextInput.js';
import RoundButton from '../../../../sun/js/buttons/RoundButton.js';
import PlayStopButton from '../../../../scenery-phet/js/buttons/PlayStopButton.js';
import RoundToggleButton from '../../../../sun/js/buttons/RoundToggleButton.js';
import { drawTheta, drawVelocity } from '../../common/makeGraphs.js';
import { verifyEq} from '../../common/verifyEq.js';
import EquationInput from './EquationInput.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
// import * as THREE from '../../../../chipper/node_modules/@types/three/index.d.js';
// import * as THREE from 'THREE';
// import * as MathQuill  from '../../common/mathquill.min.js';

type SelfOptions = {
 //TODO add options that are specific to BeadOnHoopScreenView here
};

type BeadOnHoopScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class BeadOnHoopScreenView extends ScreenView {
  
  public readonly sceneNode!: ThreeIsometricNode;
  public readonly sceneNodeTest!: ThreeIsometricNode;
  private readonly cubeMesh!: THREE.Mesh;
  private readonly cubeMeshTest!: THREE.Mesh;
  private readonly hoop!: THREE.Mesh;
  private readonly hoopTest!: THREE.Mesh;
  private readonly ball!: THREE.Mesh;
  private readonly ballTest!: THREE.Mesh;
  private omega: Property<number>;
  private model: BeadOnHoopModel;
  private refThetaGraph!: any;
  private testThetaGraph!: any;
  private refVelocityGraph!: any;
  private testVelocityGraph!: any;
  private buttonAddThetaDOM!: any;
  private buttonAddOmegaDOM!: any;
  private thetaFieldDOM!: any;
  private velocityFieldDOM!: any;
  private focusedEq!: any;
  private rootNode!: any;
  private thetaBox:any;
  private velBox:any;
  private balls:any;
  private prevCords:any;
  private ballsCords:any;
  private ballsTest:any;
  private prevCordsTest:any;
  private ballsCordsTest:any;
  private trailLen:number;
  private project: boolean;
  private projectTemp : boolean;
  private graphSize: number;
  public constructor( model: BeadOnHoopModel, providedOptions: BeadOnHoopScreenViewOptions ) {

    const options = optionize<BeadOnHoopScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );
    // Create a full-screen node
    
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
    this.graphSize = window.innerWidth/4.5;
    this.model = model;
    this.omega = model.omegaProp
    this.rotation = 0;
    // const refThetaGraph = document.createElement("div")
    // refThetaGraph.id = "staticSim-theta";
    // const d3Graph = drawTheta(model.graphData, model.graphLen, "staticSim-theta", "test");
    // this.addChild(new DOM(d3Graph))
    const refThetaGraph = document.createElement( 'div' );
    document.body.appendChild( refThetaGraph );
    const testThetaGraph = document.createElement( 'div' );
    document.body.appendChild( testThetaGraph );
    const refVelocityGraph = document.createElement( 'div' );
    document.body.appendChild( refVelocityGraph );
    const testVelocityGraph = document.createElement( 'div' );
    document.body.appendChild( testVelocityGraph );

    this.rootNode = new phet.scenery.Node();
    const display = new phet.scenery.Display( this.rootNode );
    display.updateOnRequestAnimationFrame();
    display.resizeOnWindowResize();
    document.body.appendChild( display.domElement );
    
    // resize the display to fill the window and update it every animation frame

    // console.log(model.graphData)
    refVelocityGraph.id = 'staticSim-velocity';
    this.refVelocityGraph = drawVelocity( model.graphData, model.graphLen, 'staticSim-velocity', 'reference',this.graphSize );
    this.refVelocityGraph = new phet.scenery.DOM( this.refVelocityGraph );
    this.rootNode.addChild( this.refVelocityGraph );
    this.refVelocityGraph.centerBottom = new phet.dot.Vector2( (window.innerWidth*2.7) / 4, window.innerHeight/2-20 );


    testVelocityGraph.id = 'variableSim-velocity';
    this.testVelocityGraph = drawVelocity( model.graphDataTest, model.graphLen, 'variableSim-velocity', 'test',this.graphSize );
    this.testVelocityGraph = new phet.scenery.DOM( this.testVelocityGraph );
    this.rootNode.addChild( this.testVelocityGraph );
    this.testVelocityGraph.centerBottom = new phet.dot.Vector2( (window.innerWidth*2.7) / 4, window.innerHeight*1.8/2-20 );

    refThetaGraph.id = 'staticSim-theta';
    this.refThetaGraph = drawTheta( model.graphData, model.graphLen, 'staticSim-theta', 'reference',this.graphSize );
    this.refThetaGraph = new phet.scenery.DOM( this.refThetaGraph );
    this.rootNode.addChild( this.refThetaGraph );
    this.refThetaGraph.centerBottom = new phet.dot.Vector2( this.testVelocityGraph.leftBottom.x + this.graphSize*1.45, window.innerHeight/2-20 );


    testThetaGraph.id = 'variableSim-theta';
    this.testThetaGraph = drawTheta( model.graphDataTest, model.graphLen, 'variableSim-theta', 'test',this.graphSize );
    this.testThetaGraph = new phet.scenery.DOM( this.testThetaGraph );
    this.rootNode.addChild( this.testThetaGraph );
    this.testThetaGraph.centerBottom = new phet.dot.Vector2( this.testVelocityGraph.leftBottom.x + this.graphSize*1.45, window.innerHeight*1.8/2-20 );



    
    // this.addChild(d3GraphNode);
    // console.log(this.refThetaGraph.element.children[6])
    let oldWidth = window.innerWidth;
  let oldHeight = window.innerHeight;

  setInterval(() => {
      if (window.innerWidth !== oldWidth || window.innerHeight !== oldHeight) {
          // Update the centerBottom property of each graph
          this.refVelocityGraph.centerBottom = new phet.dot.Vector2( (window.innerWidth*2.7) / 4, window.innerHeight/2-20 );
          this.testVelocityGraph.centerBottom = new phet.dot.Vector2( (window.innerWidth*2.7) / 4, window.innerHeight*1.8/2-20 );
          this.refThetaGraph.centerBottom = new phet.dot.Vector2( this.testVelocityGraph.leftBottom.x + this.graphSize*1.45, window.innerHeight/2-20 );
          this.testThetaGraph.centerBottom = new phet.dot.Vector2( this.testVelocityGraph.leftBottom.x + this.graphSize*1.45, window.innerHeight*1.8/2-20 );

          oldWidth = window.innerWidth;
          oldHeight = window.innerHeight;
      }
  }, 100);
  
    
  

    const buttonRadius = new Property<boolean>(false); 
    const buttonGravity = new Property<boolean>(false);
    const buttonFriction = new Property<boolean>(false);
    const buttonOmega = new Property<boolean>(false);
    const buttonOmegaRads = new Property<boolean>(false);
    const buttonTheta = new Property<boolean>(false);
    const buttonVelocity = new Property<boolean>(false);
    const buttonSimSpeed = new Property<boolean>(false);

    const fontSize = 20;
    var toggleRadius = 11;
    const exText = new phet.scenery.Text("radius", {fontSize: fontSize, textAlign: false});
    const exRichText = new RichText('✎');
    const simSpeedSlider = new HSlider(model.simSpeedProp, new Range(0,Number(3)), {helpText: 'Simulation Speed'});
    // simSpeedSlider.setHelpText('Simulation Speed')
    const exampleButton = new RoundToggleButton( buttonRadius, false, true, {radius:toggleRadius});
    var textVBox = new VBox({ align: 'left',children:[
      // new Rectangle(0,0,0,exampleSlider.height-exText.height),
      new phet.scenery.Text("radius (r)", {fontSize: fontSize, textAlign: 'left'}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new phet.scenery.Text("gravity (g)", {fontSize: fontSize, textAlign: 'left'}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new phet.scenery.Text("friction (k)", {fontSize: fontSize, textAlign: 'left'}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new phet.scenery.Text("omega (ω)", {fontSize: fontSize, textAlign: 'left'}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new phet.scenery.Text("omegaRads (ω)", {fontSize: fontSize, textAlign: 'left'}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new phet.scenery.Text("theta (θ)", {fontSize: fontSize, textAlign: 'left'}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new phet.scenery.Text("velocity (v)", {fontSize: fontSize, textAlign: 'left'}), 
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new phet.scenery.Text("simSpeed", {fontSize: fontSize, textAlign: 'left'}),

    ]})

    var sliderVbox = new VBox({children:[
      new HSlider(model.radiusProp, new Range(0.1,Number(100))),
      new HSlider(model.gravityProp, new Range(0,Number(100))), 
      new HSlider(model.frictionProp, new Range(0,Number(100))),
      new HSlider(model.omegaProp, new Range(0,Number(5000))), 
      new HSlider(model.omegaRadsProp, new Range(0,Number(90))),
      new HSlider(model.thetaProp, new Range(0,Number(360))), 
      new HSlider(model.velocityProp, new Range(0,Number(10))),
      simSpeedSlider,

    ]})
    
    

    var buttonVBox = new VBox({children:[
      new RoundToggleButton( buttonRadius, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),
      new RoundToggleButton( buttonGravity, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),
      new RoundToggleButton( buttonFriction, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),
      new RoundToggleButton( buttonOmega, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),
      new RoundToggleButton( buttonOmegaRads, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),
      new RoundToggleButton( buttonTheta, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),
      new RoundToggleButton( buttonVelocity, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),
      new RoundToggleButton( buttonSimSpeed, false, true, {radius:toggleRadius}),
      new RichText('✎'),
      new Rectangle(0,0,0,simSpeedSlider.height - exRichText.height),

    ]})

    var dynamicTextVBox = new VBox({align: 'left',children:[
      new HBox({children: [
        new RichText(new DerivedProperty([model.radiusProp], (value) => {return String(Number(value).toFixed(2))})),
        new phet.scenery.Text(" m", {fontSize: fontSize, textAlign: 'left'})
      ]}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new HBox({children: [
        new RichText(new DerivedProperty([model.gravityProp], (value) => {return String(Number(value).toFixed(2))})),
        new phet.scenery.Text(" m/s^2", {fontSize: fontSize, textAlign: 'left'})
      ]}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new HBox({children: [
        new RichText(new DerivedProperty([model.frictionProp], (value) => {return String(Number(value).toFixed(2))})),
        // new phet.scenery.Text(" units", {fontSize: fontSize, textAlign: 'left'})
      ]}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new HBox({children: [
        new RichText(new DerivedProperty([model.omegaProp], (value) => {return String(Number(value).toFixed(2))})),
        new phet.scenery.Text(" °/s", {fontSize: fontSize, textAlign: 'left'})
      ]}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new HBox({children: [
        new RichText(new DerivedProperty([model.omegaRadsProp], (value) => {return String(Number(value).toFixed(2))})),
        new phet.scenery.Text(" rad/s", {fontSize: fontSize, textAlign: 'left'})
      ]}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new HBox({children: [
        new RichText(new DerivedProperty([model.thetaProp], (value) => {return String(Number(value).toFixed(2))})),
        new phet.scenery.Text(" °", {fontSize: fontSize, textAlign: 'left'})
      ]}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new HBox({children: [
        new RichText(new DerivedProperty([model.velocityProp], (value) => {return String(Number(value).toFixed(2))})),
        new phet.scenery.Text(" m/s", {fontSize: fontSize, textAlign: 'left'})
      ]}),
      new Rectangle(0,0,0,simSpeedSlider.height-exText.height),
      new HBox({children: [
        new RichText(new DerivedProperty([model.simSpeedProp], (value) => {return String(Number(value).toFixed(2))})),
        new phet.scenery.Text(" x", {fontSize: fontSize, textAlign: 'left'})
      ]}),
    ]});
    
    //button vbox here use:, {radius:5}
    // rich text vbox here
    // textVBox.rightCenter = new phet.dot.Vector2((window.innerWidth) / 6, window.innerHeight/4 );
    
    // textVBox.centerBottom = new phet.dot.Vector2( window.innerWidth/2, , window.innerHeight/4 );
    // console.log(this.height/63)
    textVBox.leftTop = new phet.dot.Vector2( -this.width/.6,  this.layoutBounds.maxY/10 );
    sliderVbox.leftCenter = new phet.dot.Vector2( textVBox.rightCenter.x, textVBox.rightCenter.y);
    buttonVBox.leftCenter = new phet.dot.Vector2( sliderVbox.rightCenter.x+10, sliderVbox.rightCenter.y);
    dynamicTextVBox.leftCenter = new phet.dot.Vector2( buttonVBox.rightCenter.x+10, buttonVBox.rightCenter.y);

    this.addChild(textVBox);
    this.addChild(sliderVbox);
    this.addChild(buttonVBox);
    this.addChild(dynamicTextVBox);

    

    const errField = new phet.scenery.Text("", {fontSize: fontSize, textAlign: false});

    
  
    const velocityDOM = document.createElement( 'span' ); 
    const thetaDOM = document.createElement( 'span' ); 
    velocityDOM.classList.add("my-mathquill-input");
    thetaDOM.classList.add("my-mathquill-input");
    
    const velocityField = new EquationInput(this.sceneNode, velocityDOM,
      {
        initialText: model.velocityEQ,
        model:model,
        equation: 'velocityEQ',
        verifyEq:verifyEq,
        errField:errField,
        focusedEq:this.focusedEq
      }
      
      
      );
    const thetaField = new EquationInput(this.sceneNode, thetaDOM,
      {
        initialText: model.thetaEQ,
        model:model,
        equation: 'thetaEQ',
        verifyEq:verifyEq,
        errField:errField,
        focusedEq:this.focusedEq
      }
      
      
      );
      this.focusedEq = [model.velocityEQ,velocityField,velocityField.writeToEquation];
      const focusedEq = [this.focusedEq]
      const velBox = new HBox({children: [velocityField]})
      velBox.centerBottom = new phet.dot.Vector2( this.layoutBounds.maxX/3, window.innerHeight - 550 );
      // velocityField.centerBottom = new phet.dot.Vector2( this.layoutBounds.maxX/3, window.innerHeight - 550 );
      
      
      velBox.addInputListener( { // try making it just to size of mathquil inputs? and using that?
            
      down: function( event ) {
        // Check if the click was inside your node
        velocityField.mathField.focus(); 
        focusedEq[0][0] = model.velocityEQ
        focusedEq[0][1] = velocityField
        
        console.log( 'Click inside velocity equation detected' );
      }
    } );
    this.addChild(velBox)
    const thetaBox = new HBox({children: [thetaField]})
    thetaBox.centerBottom = new phet.dot.Vector2( this.layoutBounds.maxX/3, window.innerHeight - 500 );
    this.addChild(thetaBox)
    thetaBox.addInputListener( { // try making it just to size of mathquil inputs? and using that?
    down: function( event ) {
      // Check if the click was inside your node
      thetaField.mathField.focus(); 
      focusedEq[0][0] = model.thetaEQ
        focusedEq[0][1] = thetaField
      console.log( 'Click inside theta equation detected' );
    }
  } );
    // velocityDOM.addEventListener("click", ()=>{this.focusedEq = [model.velocityEQ,velocityField];velocityField.mathField.focus();console.log('clicked mathquil');sliders.focus()});
    // thetaDOM.addEventListener("click", ()=>{this.focusedEq = [model.thetaEQ,thetaField];thetaField.mathField.focus();console.log('clicked mathquil');this.sceneNode.focus();sliders.focus()});
    const test = new phet.scenery.Text("", {fontSize: fontSize, textAlign: false});
    this.addChild(test)
        // thetaField.centerBottom = new phet.dot.Vector2( this.layoutBounds.maxX/3, window.innerHeight - 500 );
        velBox.centerBottom = new phet.dot.Vector2( this.width/7.7, this.layoutBounds.maxY/1.18 );
        thetaBox.leftCenter = new phet.dot.Vector2( velBox.leftCenter.x, velBox.leftCenter.y + velBox.height + 5  );

        var thetadot = document.createElement('span');
        thetadot.innerHTML= '<span>θ&#x307;</span>=  ';
        const thetadotDOM = new phet.scenery.DOM((thetadot));
        thetadotDOM.rightCenter = new phet.dot.Vector2( thetaBox.leftCenter.x-5, thetaBox.leftCenter.y );
        this.addChild(thetadotDOM);

        var vdot = document.createElement('span');
        vdot.innerHTML= '<span>v&#x307;</span>=  ';
        const vdotDOM = new phet.scenery.DOM((vdot));
        vdotDOM.rightCenter = new phet.dot.Vector2( velBox.leftCenter.x-5, velBox.leftCenter.y );
        this.addChild(vdotDOM);
        // velocityField.left = new phet.dot.Vector2( thetaField.left, window.innerHeight - 550 );

        errField.leftCenter = new phet.dot.Vector2( thetaBox.leftCenter.x, thetaBox.centerBottom.y+20 );
        this.addChild(errField)
      // velocityField.equationInputNode.addEventListener("onclick", ()=>{this.focusedEq = [model.velocityEQ,velocityField];velocityField.mathField.focus();console.log('clicked mathquil')})
      
      const buttonAddTheta = new Property<boolean>(false);
      buttonAddTheta.lazyLink(() => {console.log(this.focusedEq[2]);this.focusedEq[1].writeToEquation('\\theta');this.focusedEq[0] = this.focusedEq[1].getElementValue().replaceAll('\\theta',' t').replaceAll('\\omega',' o');console.log(this.focusedEq[0]);model.validEqs = verifyEq( errField, model);this.focusedEq[1].mathField.focus()}) 
      // console.log(this.focusedEq[1].value,'bruuuh')
      const buttonAddOmega = new Property<boolean>(false);
      buttonAddOmega.lazyLink(() => {this.focusedEq[1].writeToEquation('\\omega');this.focusedEq[0] = this.focusedEq[1].getElementValue().replaceAll('\\theta',' t').replaceAll('\\omega',' o');console.log(this.focusedEq[0]);model.validEqs = verifyEq( errField, model);this.focusedEq[1].mathField.focus()}) 
      
      this.buttonAddThetaDOM = new RoundToggleButton( buttonAddTheta, false, true, {radius:10})

      this.addChild(this.buttonAddThetaDOM)
      
      
      this.buttonAddOmegaDOM = new RoundToggleButton( buttonAddOmega, false, true, {radius:10})
      this.addChild(this.buttonAddOmegaDOM)
      // this.addChild(velocityField);
      // this.addChild(thetaField)
      this.thetaBox = thetaBox;
      this.velBox = velBox;
      this.project = true;
      this.projectTemp = this.project;
      const projectSwitch = new Property<boolean>(this.project);
      projectSwitch.lazyLink(()=>{this.projectTemp = !this.projectTemp})

      const projectSwitchDOM = new ToggleSwitch(projectSwitch, false, true, {size:new Dimension2(40, 15)})
      const projectLabel = new RichText('Project trail onto hoop?');
      this.addChild(projectLabel)
      projectLabel.leftCenter = new phet.dot.Vector2(textVBox.leftCenter.x+ 10, textVBox.centerBottom.y + 30)
      projectSwitchDOM.leftCenter = new phet.dot.Vector2(projectLabel.rightCenter.x + 10, projectLabel.leftCenter.y)
      this.addChild(projectSwitchDOM);
      const referenceLabel = new RichText('Reference:');
      const testLabel = new RichText('Test:');
      referenceLabel.leftCenter = new phet.dot.Vector2(320,10)
      this.addChild(referenceLabel);
      testLabel.leftCenter = new phet.dot.Vector2(340,this.layoutBounds.maxY/2.2)
      this.addChild(testLabel);
  
      // document.body.appendChild( display.domElement );
      if ( !ThreeUtils.isWebGLEnabled() ) {
        ThreeUtils.showWebGLWarning( this );
        this.enabled = false;
        return;
      }
  
      // ---------------------------reference SIm threejs
      this.sceneNode = new ThreeIsometricNode( this.layoutBounds, {
        parentMatrixProperty: animatedPanZoomSingleton.listener!.matrixProperty,
        cameraPosition: new Vector3( -.75, 0, 2 )
      } );
      // this.rootNode.addChild( this.sceneNode );
      const rootThreeNode = new phet.scenery.Node();
      const displayThree = new phet.scenery.Display( rootThreeNode );
      displayThree.updateOnRequestAnimationFrame();
      displayThree.resizeOnWindowResize();
      rootThreeNode.addChild( this.sceneNode );
      this.addChild(rootThreeNode);
      // rootThreeNode.centerBottom = new phet.dot.Vector2( window.innerWidth -window.innerWidth*1.3, 0 );
      console.log()
      rootThreeNode.leftTop = new phet.dot.Vector2(-50, 0 );
      // Camera settings
      this.sceneNode.stage.threeCamera.zoom = 2;
      this.sceneNode.stage.threeCamera.position.set(-5,-0.5,16)
      this.sceneNode.stage.threeCamera.updateProjectionMatrix();
      // this.sceneNode.stage.threeCamera.up = new THREE.Vector3( 0, 0, 0 );
      // this.sceneNode.stage.threeCamera.lookAt( ThreeUtils.vectorToThree( Vector3.ZERO ) );
  
      // Lights
      const ambientLight = new THREE.AmbientLight( 0x333333 );
      this.sceneNode.stage.threeScene.add( ambientLight );
      const sunLight = new THREE.DirectionalLight( 0xffffff, 1 );
      sunLight.position.set( -1, 1.5, 0.8 );
      this.sceneNode.stage.threeScene.add( sunLight );
      const moonLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
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
      this.hoop.position.set(-5,1.5,0);
      this.sceneNode.stage.threeScene.add( this.hoop );
      const geometryBall = new THREE.SphereGeometry( .12, 8,8 );
      const materialBall = new THREE.MeshLambertMaterial( { color: 0xff0000} );
      this.ball = new THREE.Mesh( geometryBall, materialBall );
      this.ball.position.set(1.5,0,0);
      this.sceneNode.stage.threeScene.add( this.ball );
      // Toss some Node content into the 3D scene. Would call update() on the NodeTexture whenever it needs updates.
      this.balls = [];
      this.ballsCords = [];
      this.trailLen = 40;
      for (let i = 0; i < this.trailLen; i++) {
        this.balls.push(new THREE.Mesh( new THREE.SphereGeometry( i/this.trailLen*.12 +.01, 5,5 ), new THREE.MeshLambertMaterial( { color: 0xff0000, transparent: true, opacity: 0+i/this.trailLen, lightMapIntensity:.5} )));
        this.ballsCords.push(999);
      }
      this.balls.forEach((e: Object3D<Event>)=>{this.sceneNode.stage.threeScene.add(e);e.position.set(99,0,0)});
      this.prevCords = []; 
      this.prevCords.length = this.trailLen; 
      this.prevCords.fill(999);
  
      this.ballsTest = [];
      this.ballsCordsTest = [];
      // this.trailLen = 20;
      for (let i = 0; i < this.trailLen; i++) {
        this.ballsTest.push(new THREE.Mesh( new THREE.SphereGeometry( i/this.trailLen*.12 +.01, 5,5 ), new THREE.MeshLambertMaterial( { color: 0xff0000, transparent: true, opacity: 0+i/this.trailLen, lightMapIntensity:.5} )));
        this.ballsCordsTest.push(999);
      }
      this.ballsTest.forEach((e: Object3D<Event>)=>{this.sceneNode.stage.threeScene.add(e);e.position.set(99,0,0)});
      this.prevCordsTest = []; 
      this.prevCordsTest.length = this.trailLen; 
      this.prevCordsTest.fill(999);
        // -------------------------------------------------------------------TEST sim threejs
  
  
      // const ambientLightTest = new THREE.AmbientLight( 0x333333 );
      // this.sceneNode.stage.threeScene.add( ambientLightTest );
      // const sunLightTest = new THREE.DirectionalLight( 0xffffff, 1 );
      // sunLightTest.position.set( -1, 1.5, 0.8 );
      // this.sceneNode.stage.threeScene.add( sunLightTest );
      // const moonLightTest = new THREE.DirectionalLight( 0xffffff, 0.2 );
      // moonLightTest.position.set( 2.0, -1.0, 1.0 );
      // this.sceneNode.stage.threeScene.add( moonLightTest );
  
      const cubeGeometryTest = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
      const cubeMaterialTest = new THREE.MeshLambertMaterial( {
        color: 0xFF0000
      } );
  
      // Create a mesh with the geometry and material
      this.cubeMeshTest = new THREE.Mesh( cubeGeometryTest, cubeMaterialTest );
      //this.sceneNode.stage.threeScene.add( this.cubeMesh );
      // const lightFront = new THREE.PointLight( 0xffffff, 2, 0 );
      // lightFront.position.set( 0, 0, 10000 );
      // this.sceneNode.stage.threeScene.add( lightFront );
      const geometryHoopTest = new THREE.TorusGeometry(1.5,.07,16,50, 2*Math.PI);
      const materialHoopTest = new THREE.MeshLambertMaterial({color: 0x44aa88, lightMapIntensity:.5}); 
      this.hoopTest = new THREE.Mesh(geometryHoopTest, materialHoopTest);
      this.hoopTest.position.set(-5,-2.0,0);
      this.sceneNode.stage.threeScene.add( this.hoopTest );
      const geometryBallTest = new THREE.SphereGeometry( .12, 8,8 );
      const materialBallTest = new THREE.MeshLambertMaterial( { color: 0xff0000, lightMapIntensity:.5} );
      this.ballTest = new THREE.Mesh( geometryBallTest, materialBallTest );
      this.ballTest.position.set(1.5,0,0);
      this.sceneNode.stage.threeScene.add( this.ballTest );

      const rootNodeClone = this.rootNode;
      let changing = false;
      const reset =  () => {
        model.reset()
        this.reset()
      }
      for (var slider of sliderVbox._children ){

        console.log(slider === simSpeedSlider)
        if (slider !== simSpeedSlider){
          slider.addInputListener({
            down: function( event ) {
              
                rootNodeClone.setVisible(false)
                rootThreeNode.setVisible(false)
                console.log( 'Sliders mouse down' );
                changing = true;
              
            
          },
          mouseup: function( event ) {
            // Check if the click was inside your node
            if (changing){
              // model.reset()
              reset()
              rootNodeClone.setVisible(true)
              rootThreeNode.setVisible(true)
              console.log( 'Sliders sliders mouse up' );
              changing = false
            }
          },
          out: function (event) {
            if(changing){
              // model.reset()
              reset()
              console.log('click')
              rootNodeClone.focus()
              rootNodeClone.setVisible(true)
              rootThreeNode.setVisible(true)
              console.log( 'Sliders sliders mouse up' );
              changing = false;
            }
            
          }
        } )
        }
      }
    buttonRadius.lazyLink(()=>{model.radiusProp.value = Number(window.prompt("Enter value for radius:"));reset();}) 
    buttonGravity.lazyLink(()=>{model.gravityProp.value = Number(window.prompt("Enter value for gravity:"));reset();})
    buttonFriction.lazyLink(()=>{model.frictionProp.value = Number(window.prompt("Enter value for friction:"));reset();})
    buttonOmega.lazyLink(()=>{model.omegaProp.value = Number(window.prompt("Enter value for omega in degrees:"));reset();})
    buttonOmegaRads.lazyLink(()=>{model.omegaRadsProp.value = Number(window.prompt("Enter value for omega in radians:"));reset();})
    buttonTheta.lazyLink(()=>{model.thetaProp.value = Number(window.prompt("Enter value for theta:"));reset();})
    buttonVelocity.lazyLink(()=>{model.velocityProp.value = Number(window.prompt("Enter value for velocity:"));reset();})
    buttonSimSpeed.lazyLink(()=>{model.simSpeedProp.value = Number(window.prompt("Enter value for simulation speed:"));})

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
    this.thetaBox.detach();
    this.addChild(this.thetaBox)
    this.velBox.detach();
    this.addChild(this.velBox)
    
    this.buttonAddThetaDOM.centerBottom = new phet.dot.Vector2(this.velBox.x+30, this.velBox.y-15 );
    this.buttonAddOmegaDOM.centerBottom = new phet.dot.Vector2(this.buttonAddThetaDOM.centerBottom.x + 50, this.buttonAddThetaDOM.centerBottom.y);
    const thetaLabel = new RichText('θ');
    thetaLabel.center = new phet.dot.Vector2(this.buttonAddThetaDOM.center.x,this.buttonAddThetaDOM.center.y)
    this.addChild(thetaLabel)
    const omegaLabel = new RichText('ω');
    omegaLabel.center = new phet.dot.Vector2(this.buttonAddOmegaDOM.center.x,this.buttonAddOmegaDOM.center.y)
    this.addChild(omegaLabel)
  }

  /**
   * Steps forward in time.
   */
  public reset(): void {
    if (this.model !== undefined){
      if(this.model.validEqs){
        this.ball.position.set(0,0,0)
        this.sceneNode.render( undefined );
        this.project = this.projectTemp
        console.log(this.project)
        
        for (let i = 0; i < this.trailLen; i++) {
          this.balls[i].position.set(999,999,999)
          this.ballsTest[i].position.set(999,999,999)
          this.ballsCords[i] = 999
          this.ballsCordsTest[i] = 999
          this.prevCords[i] = 999
          this.prevCordsTest[i] = 999
        }
        
  }}}
  public override step( dt: number): void {
    // this.thetaBox.detach();
    // this.addChild(this.thetaBox)
    // this.velBox.detach();
    // this.addChild(this.velBox)
    // If the simulation was not able to load for WebGL, bail out
    if ( !this.sceneNode ) {
      return;
    }
    

    this.hoop.rotation.y = this.model.rotation;
    this.hoopTest.rotation.y = this.model.rotation;
    // this.hoop.rotateY( dt*this.omega.value);

    const cords = this.getBallPos(3*Math.PI/2+this.model.angle,1.5)
    this.ball.position.set(cords[0]*Math.cos(this.model.rotation )-5,  cords[1]+1.5,  -cords[0]*Math.sin(this.model.rotation));
    const cordsTest = this.getBallPos(3*Math.PI/2+this.model.angleTest,1.5)
    this.ballTest.position.set(cordsTest[0]*Math.cos(this.model.rotation )-5,  cordsTest[1]-2,  -cordsTest[0]*Math.sin(this.model.rotation));
    if (this.project){
      this.ballsCords.push(this.model.angle);
      this.ballsCords.shift();
    }
    let xyz = {x:cords[0]*Math.cos(this.model.rotation )-5,  y:cords[1]+1.5,  z:-cords[0]*Math.sin(this.model.rotation)};
    // ball.position.set(xyz.x,xyz.y,xyz.z);
    this.prevCords.push([xyz.x,xyz.y,xyz.z]);
    this.prevCords.shift();
    for (let i = 0; i < this.trailLen; i++) {
      if (this.prevCords[i] != 999){
        if (this.project){
          let tempCord = this.getBallPos(this.ballsCords[i]+3*Math.PI/2, 1.5);
          this.balls[i].position.set(tempCord[0]*Math.cos(this.model.rotation)-5,  tempCord[1]+1.5,  -tempCord[0]*Math.sin(this.model.rotation))
        } else {
          this.balls[i].position.set(this.prevCords[i][0],this.prevCords[i][1],this.prevCords[i][2])
      }
    }
    }

    if (this.project){
      this.ballsCordsTest.push(this.model.angleTest);
      this.ballsCordsTest.shift();
    }
    let xyzTest = {x:cordsTest[0]*Math.cos(this.model.rotation )-5,  y:cordsTest[1]-2,  z:-cordsTest[0]*Math.sin(this.model.rotation)};
    // ball.position.set(xyz.x,xyz.y,xyz.z);
    this.prevCordsTest.push([xyzTest.x,xyzTest.y,xyzTest.z]);
    this.prevCordsTest.shift();
    for (let i = 0; i < this.trailLen; i++) {
      if (this.prevCordsTest[i] != 999){
        if (this.project){
          let tempCord = this.getBallPos(this.ballsCordsTest[i]+3*Math.PI/2, 1.5);
          this.ballsTest[i].position.set(tempCord[0]*Math.cos(this.model.rotation)-5,  tempCord[1]-2,  -tempCord[0]*Math.sin(this.model.rotation))
        } else {
          this.ballsTest[i].position.set(this.prevCordsTest[i][0],this.prevCordsTest[i][1],this.prevCordsTest[i][2])
      }
    }
    }

    const margin = { top: this.graphSize/35, right: 30, bottom: this.graphSize/(35/3), left: 60 };
    const width = this.graphSize - margin.left - margin.right;
    const height = this.graphSize - margin.top - margin.bottom;
    // const x = d3.scaleLinear()
    //   .domain([0,this.model.graphLen])
    //   .range([ 0, 310]);
      const xRef = d3.scaleLinear()
      .domain( [0,this.model.graphLen] )
      .range( [ margin.left, width+margin.left] );
      const xTest = d3.scaleLinear()
      .domain( [0,this.model.graphLen] )
      .range( [ margin.left, width+margin.left] );
      const minYTref = d3.min(this.model.graphData.data, (d: { theta: any; }) => d.theta)
      const maxYTref = d3.max(this.model.graphData.data, (d: { theta: any; }) => d.theta)
      const minYTtest = d3.min(this.model.graphDataTest.data, (d: { theta: any; }) => d.theta)
      const maxYTtest = d3.max(this.model.graphDataTest.data, (d: { theta: any; }) => d.theta)
      const minYVref = d3.min(this.model.graphData.data, (d: { velocity: any; }) => d.velocity)
      const maxYVref = d3.max(this.model.graphData.data, (d: { velocity: any; }) => d.velocity)
      const minYVtest = d3.min(this.model.graphDataTest.data, (d: { velocity: any; }) => d.velocity)
      const maxYVtest = d3.max(this.model.graphDataTest.data, (d: { velocity: any; }) => d.velocity)
      const yRef = d3.scaleLinear()
      .domain([maxYTref, minYTref])
      .range([  margin.bottom,height-margin.bottom ]);
      const yTest = d3.scaleLinear()
      .domain([maxYTtest, minYTtest])
      .range([  margin.bottom,height-margin.bottom ]);
      const yVref = d3.scaleLinear()
      .domain([maxYVref, minYVref])
      .range([ margin.bottom, height-margin.bottom ]);
      const yVtest = d3.scaleLinear()
      .domain([maxYVtest, minYVtest])
      .range([ margin.bottom, height-margin.bottom ]);
    this.refThetaGraph.element.children[6].setAttribute('cx', xRef(this.model.timer));
    this.refThetaGraph.element.children[6].setAttribute('cy', yRef(this.model.angle));
    this.testThetaGraph.element.children[6].setAttribute('cx', xTest(this.model.timer));
    this.testThetaGraph.element.children[6].setAttribute('cy', yTest(this.model.angleTest));
    // console.log(this.model.angleTest)
    this.refVelocityGraph.element.children[6].setAttribute('cx', xRef(this.model.timer));
    this.refVelocityGraph.element.children[6].setAttribute('cy', yVref(this.model.velocity));
    this.testVelocityGraph.element.children[6].setAttribute('cx', xTest(this.model.timer));
    this.testVelocityGraph.element.children[6].setAttribute('cy', yVtest(this.model.velocityTest));
    // console.log(this.refThetaGraph)
    if (this.model.updateGraphs){
      this.model.updateGraphs = false;

      this.refThetaGraph.detach()
      this.refThetaGraph = new phet.scenery.DOM(drawTheta( this.model.graphData, this.model.graphLen, 'staticSim-theta', 'reference',this.graphSize));
      this.rootNode.addChild(this.refThetaGraph);

      this.testThetaGraph.detach()
      this.testThetaGraph = new phet.scenery.DOM(drawTheta( this.model.graphDataTest, this.model.graphLen, 'variableSim-theta', 'test',this.graphSize));
      this.rootNode.addChild(this.testThetaGraph);

      this.refVelocityGraph.detach()
      this.refVelocityGraph = new phet.scenery.DOM(drawVelocity( this.model.graphData, this.model.graphLen, 'staticSim-velocity', 'reference',this.graphSize));
      this.rootNode.addChild(this.refVelocityGraph);

      this.testVelocityGraph.detach()
      this.testVelocityGraph = new phet.scenery.DOM(drawVelocity( this.model.graphDataTest, this.model.graphLen, 'staticSim-velocity', 'test',this.graphSize));
      this.rootNode.addChild(this.testVelocityGraph);

      this.refVelocityGraph.centerBottom = new phet.dot.Vector2( (window.innerWidth*2.7) / 4, window.innerHeight/2-20 );
      this.testVelocityGraph.centerBottom = new phet.dot.Vector2( (window.innerWidth*2.7) / 4, window.innerHeight*1.8/2-20 );
      this.refThetaGraph.centerBottom = new phet.dot.Vector2( this.testVelocityGraph.leftBottom.x + this.graphSize*1.45, window.innerHeight/2-20 );
      this.testThetaGraph.centerBottom = new phet.dot.Vector2( this.testVelocityGraph.leftBottom.x + this.graphSize*1.45, window.innerHeight*1.8/2-20 );
    }
    
    
    this.sceneNode.render( undefined );
  }
  getBallPos(angle: number,radius: number){
    let x = radius*Math.cos(angle);
    let y = radius*Math.sin(angle);
  return [x,y];
  }
}

beadOnHoop.register( 'BeadOnHoopScreenView', BeadOnHoopScreenView );