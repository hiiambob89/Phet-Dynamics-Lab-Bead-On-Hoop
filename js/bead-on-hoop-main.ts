// Copyright 2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Kaden Hart
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import MobiusStrings from '../../mobius/js/MobiusStrings.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import BeadOnHoopScreen from './bead-on-hoop/BeadOnHoopScreen.js';
import BeadOnHoopStrings from './BeadOnHoopStrings.js';
import './common/BeadOnHoopQueryParameters.js';


// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = BeadOnHoopStrings[ 'bead-on-hoop' ].titleStringProperty;

  const screens = [
    new BeadOnHoopScreen( { tandem: Tandem.ROOT.createTandem( 'beadOnHoopScreen' ) } )
  ];

  const options: SimOptions = {

    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    
    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      contributors: '',
      qualityAssurance: '', 
      graphicArts: '',
      soundDesign: '',
      
      thanks: ''
    },
    webgl: true
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );
// const simOptions: SimOptions = {
//   credits: {
//     leadDesign: 'PhET'
//   },
//   webgl: true
// };

// // Create and start sim
// simLauncher.launch( () => {
//   new Sim( MobiusStrings.mobius.titleStringProperty, [
//     new BeadOnHoopScreen( { tandem: Tandem.ROOT.createTandem( 'beadOnHoopScreen' ) } )
//   ], simOptions ).start();
// } );