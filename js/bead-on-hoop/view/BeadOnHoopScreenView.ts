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
import { AlignBox, FlowBox, HBox, HSeparator, RichText, VBox } from '../../../../scenery/js/imports.js';
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

type SelfOptions = {
 //TODO add options that are specific to BeadOnHoopScreenView here
};

type BeadOnHoopScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class BeadOnHoopScreenView extends ScreenView {

  public readonly sceneNode!: ThreeIsometricNode;
  private readonly cubeMesh!: THREE.Mesh;
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
    var sliderVBOXchildren = [];
    var sliderNameVBOXchildren = [];
    console.log(model.paramList)
    for (var [objKey, objVal] of Object.entries(model.paramList) as any){
      console.log(objKey)
      if (objVal.type != "checkbox"){
        const paramGroup = new HBox({children: [new phet.scenery.Text(objVal.id, {fontSize: 20, textAlign: false}), new HSeparator(),new HSlider(objVal.prop, new Range(Number(objVal.min),Number(objVal.max))), new RichText(new DerivedProperty([objVal.prop], (value) => {return String(Number(value).toFixed(2))}))]})
        sliderVBOXchildren.push(paramGroup)
      }
    }

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
      cameraPosition: new Vector3( 0, 0.4, 2 )
    } );
    this.addChild( this.sceneNode );

    // Camera settings
    this.sceneNode.stage.threeCamera.zoom = 1.7;
    this.sceneNode.stage.threeCamera.updateProjectionMatrix();
    this.sceneNode.stage.threeCamera.up = new THREE.Vector3( 0, 0, -1 );
    this.sceneNode.stage.threeCamera.lookAt( ThreeUtils.vectorToThree( Vector3.ZERO ) );

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
    this.sceneNode.stage.threeScene.add( this.cubeMesh );

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
    //TODO
    this.sceneNode.render( undefined );
  }
  public override step( dt: number ): void {
    // If the simulation was not able to load for WebGL, bail out
    if ( !this.sceneNode ) {
      return;
    }

    this.cubeMesh.rotateY( dt );

    this.sceneNode.render( undefined );
  }
}

beadOnHoop.register( 'BeadOnHoopScreenView', BeadOnHoopScreenView );