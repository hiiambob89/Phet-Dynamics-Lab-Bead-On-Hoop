// Copyright 2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import beadOnHoop from './beadOnHoop.js';

type StringsType = {
  'bead-on-hoop': {
    'titleStringProperty': LinkableProperty<string>;
  };
  'screen': {
    'nameStringProperty': LinkableProperty<string>;
  }
};

const BeadOnHoopStrings = getStringModule( 'BEAD_ON_HOOP' ) as StringsType;

beadOnHoop.register( 'BeadOnHoopStrings', BeadOnHoopStrings );

export default BeadOnHoopStrings;
