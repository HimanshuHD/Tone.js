define(["Tone/core/Tone", "Tone/instrument/Instrument", "Tone/signal/Signal"], function(Tone){

	"use strict";

	/**
	 *  @class  this is a base class for monophonic instruments. 
	 *          it defines their interfaces
	 *
	 *  @constructor
	 *  @abstract
	 *  @extends {Tone.Instrument}
	 */
	Tone.Monophonic = function(options){

		Tone.Instrument.call(this);

		//get the defaults
		options = this.defaultArg(options, Tone.Monophonic.defaults);

		/**
		 *  The glide time between notes. 
		 *  @type {Time}
		 */
		this.portamento = options.portamento;
	};

	Tone.extend(Tone.Monophonic, Tone.Instrument);

	/**
	 *  @static
	 *  @const
	 *  @type {Object}
	 */
	Tone.Monophonic.defaults = {
		"portamento" : 0
	};

	/**
	 *  Trigger the attack. Start the note, at the time with the velocity
	 *  
	 *  @param  {Frequency} note     the note
	 *  @param  {Time} [time=now]     the time, if not given is now
	 *  @param  {number} [velocity=1] velocity defaults to 1
	 *  @returns {Tone.Monophonic} this
	 *  @example
	 * synth.triggerAttack("C4");
	 */
	Tone.Monophonic.prototype.triggerAttack = function(note, time, velocity) {
		time = this.toSeconds(time);
		this._triggerEnvelopeAttack(time, velocity);
		this.setNote(note, time);
		return this;
	};

	/**
	 *  Trigger the release portion of the envelope
	 *  @param  {Time} [time=now] if no time is given, the release happens immediatly
	 *  @returns {Tone.Monophonic} this
	 *  @example
	 * synth.triggerRelease();
	 */
	Tone.Monophonic.prototype.triggerRelease = function(time){
		this._triggerEnvelopeRelease(time);
		return this;
	};

	/**
	 *  override this method with the actual method
	 *  @abstract
	 *  @private
	 */	
	Tone.Monophonic.prototype._triggerEnvelopeAttack = function() {};

	/**
	 *  override this method with the actual method
	 *  @abstract
	 *  @private
	 */	
	Tone.Monophonic.prototype._triggerEnvelopeRelease = function() {};

	/**
	 *  set the note to happen at a specific time
	 *  @param {Frequency} note if the note is a string, it will be 
	 *                              parsed as (NoteName)(Octave) i.e. A4, C#3, etc
	 *                              otherwise it will be considered as the frequency
	 *  @param  {Time} [time=now] The time when the note should be set. 
	 *  @returns {Tone.Monophonic} this
	 */
	Tone.Monophonic.prototype.setNote = function(note, time){
		time = this.toSeconds(time);
		if (this.portamento > 0){
			var currentNote = this.frequency.value;
			this.frequency.setValueAtTime(currentNote, time);
			var portTime = this.toSeconds(this.portamento);
			this.frequency.exponentialRampToValueAtTime(note, time + portTime);
		} else {
			this.frequency.setValueAtTime(note, time);
		}
		return this;
	};

	return Tone.Monophonic;
});