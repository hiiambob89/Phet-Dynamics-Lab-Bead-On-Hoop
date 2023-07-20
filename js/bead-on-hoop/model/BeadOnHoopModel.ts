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
// import data from '../../../configurations/bead_var.json' assert { type: 'json' };
type SelfOptions = {
  //TODO add options that are specific to BeadOnHoopModel here
  configFile: String;
};

type BeadOnHoopModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BeadOnHoopModel implements TModel {
  paramList;
  
  public constructor( providedOptions: BeadOnHoopModelOptions ) {
    //TODO
    this.paramList = {};
    for (const obj of BeadOnHoopConstants.BEAD_CONFIG) {
      (this.paramList as any)[obj.id] = obj;
      (this.paramList as any)[obj.id].prop = new Property(Number(obj.val));
    }
    

  }
  update(val: number){
    console.log(val)
  }
  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

beadOnHoop.register( 'BeadOnHoopModel', BeadOnHoopModel );