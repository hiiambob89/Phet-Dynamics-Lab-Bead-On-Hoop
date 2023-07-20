// Copyright 2023, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Kaden Hart
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import BeadOnHoopColors from '../common/BeadOnHoopColors.js';
import beadOnHoop from '../beadOnHoop.js';
import BeadOnHoopModel from './model/BeadOnHoopModel.js';
import BeadOnHoopScreenView from './view/BeadOnHoopScreenView.js';
import BeadOnHoopStrings from '../BeadOnHoopStrings.js';

type SelfOptions = {
  //TODO add options that are specific to BeadOnHoopScreen here
};

type BeadOnHoopScreenOptions = SelfOptions & ScreenOptions;

export default class BeadOnHoopScreen extends Screen<BeadOnHoopModel, BeadOnHoopScreenView> {

  public constructor( providedOptions: BeadOnHoopScreenOptions ) {

    const options = optionize<BeadOnHoopScreenOptions, SelfOptions, ScreenOptions>()( {
      name: BeadOnHoopStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: BeadOnHoopColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new BeadOnHoopModel( { tandem: options.tandem.createTandem( 'model' ), configFile:'../../../configurations/bead_var.json' } ),
      model => new BeadOnHoopScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

beadOnHoop.register( 'BeadOnHoopScreen', BeadOnHoopScreen );