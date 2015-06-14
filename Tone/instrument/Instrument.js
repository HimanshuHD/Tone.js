define(["Tone/core/Tone", "Tone/core/Master", "Tone/core/Note"], function(Tone){

	"use strict";

	/**
	 *  @class  Base-class for all instruments
	 *  
	 *  @constructor
	 *  @extends {Tone}
	 */
	Tone.Instrument = function(){

		/**
		 *  the output
		 *  @type {GainNode}
		 *  @private
		 */
		this.output = this.context.createGain();

		/**
		 * the volume of the output in decibels
		 * @type {Decibels}
		 * @signal
		 */
		this.volume = new Tone.Signal(this.output.gain, Tone.Type.Decibels);
		this._readOnly(["volume"]);
	};

	Tone.extend(Tone.Instrument);

	/**
	 *  the default attributes
	 *  @type {object}
	 */
	Tone.Instrument.defaults = {
		/** the volume of the output in decibels */
		"volume" : 0
	};

	/**
	 *  @abstract
	 *  @param {string|number} note the note to trigger
	 *  @param {Time} [time=now] the time to trigger the ntoe
	 *  @param {number} [velocity=1] the velocity to trigger the note
	 */
	Tone.Instrument.prototype.triggerAttack = function(){};

	/**
	 *  @abstract
	 *  @param {Time} [time=now] when to trigger the release
	 */
	Tone.Instrument.prototype.triggerRelease = function(){};

	/**
	 *  Trigger the attack and then the release after the duration. 
	 *  @param  {string|number} note     the note to trigger
	 *  @param  {Time} duration the duration of the note
	 *  @param {Time} [time=now]     the time of the attack
	 *  @param  {NormalRange} [velocity=1] the velocity
	 *  @returns {Tone.Instrument} this
	 *  @example
	 * //trigger "C4" for the duration of an 8th note
	 * synth.triggerAttackRelease("C4", "8n");
	 */
	Tone.Instrument.prototype.triggerAttackRelease = function(note, duration, time, velocity){
		time = this.toSeconds(time);
		duration = this.toSeconds(duration);
		this.triggerAttack(note, time, velocity);
		this.triggerRelease(time + duration);
		return this;
	};

	/**
	 *  clean up
	 *  @returns {Tone.Instrument} this
	 */
	Tone.Instrument.prototype.dispose = function(){
		Tone.prototype.dispose.call(this);
		this._writable(["volume"]);
		this.volume.dispose();
		this.volume = null;
		return this;
	};

	return Tone.Instrument;
});