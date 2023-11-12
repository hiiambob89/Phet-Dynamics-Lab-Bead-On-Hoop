import Constants from '../../common/BeadOnHoopConstants.js';
import { DOM, Display, Input, VBox, Node, KeyboardUtils } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';

class EquationInput extends Node {
  constructor( screenNode,parentDomElement, options ) {

    options = _.merge( {

      // can limit contents of the input
      inputType: 'text', // 'text' | 'number'

      domElement: null,

      onlyLetters: false,

      // number of characters if you want to customize
      width: null,

      // the initial text for the element
      initialText: '',

      equation: null,
      
      verifyEq: null,
      
      errField: null,

      linkObj: null,

      focusedEq: null

    }, options );

    super( options );

    this.valueSubmittedEmitter = new phet.axon.Emitter();
    this.writeToEquation = function(text){
      this.mathField.write(text)
    }
    const domElement = parentDomElement; 

    const mathField = globalThis.window.MathQuill.getInterface(2).MathField(domElement, {
      handlers: {
        edit: function() {
          options.model[options.equation]= mathField.latex().replaceAll('\\theta',' t').replaceAll('\\omega',' o');
          console.log(mathField.latex())
          options.model.validEqs = options.verifyEq(options.errField, options.model);
        }
      }
    });
    this.mathField = mathField;
    mathField.write(options.initialText);

    const equationInputNode = new Node();
    this.equationInputNode = domElement;
    const domElementDOM = new phet.scenery.DOM( domElement ) ;
    equationInputNode.addChild( domElementDOM);
    this.addChild(equationInputNode);
    

    domElement.addEventListener( 'keyup', event => {
      if ( event.code === phet.scenery.KeyboardUtils.KEY_ENTER ) {

        this.valueSubmittedEmitter.emit( mathField.latex() ); 

        mathField.blur();
      }
    } );


    this.domElement = domElement;
  }

  getElementValue() {
    return this.mathField.latex()
  }

  
}

export default EquationInput;

