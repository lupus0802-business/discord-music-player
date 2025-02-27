import { DefaultProgressBarOptions, DMPError, DMPErrors, ProgressBarOptions, Queue, Utils } from "..";

class ProgressBar {
    private queue: Queue;
    options: ProgressBarOptions = DefaultProgressBarOptions;
    bar!: string;
    times!: string;

    /**
     * ProgressBar constructor
     * @param {Queue} queue
     * @param {ProgressBarOptions} [options=DefaultProgressBarOptions]
     */
    constructor(queue: Queue, options: ProgressBarOptions = DefaultProgressBarOptions) {

        /**
         * Guild instance
         * @name ProgressBar#guild
         * @type {Guild}
         * @private
         */

        /**
         * ProgressBar options
         * @name ProgressBar#options
         * @type {PlayerOptions}
         */

        /**
         * Progress Bar without timecodes
         * @name ProgressBar#bar
         * @type {string}
         */

        /**
         * Progress Bar timecodes
         * @name ProgressBar#times
         * @type {string}
         */

        if(queue.destroyed)
            throw new DMPError(DMPErrors.QUEUE_DESTROYED);
        if(!queue.connection)
            throw new DMPError(DMPErrors.NO_VOICE_CONNECTION);
        if(!queue.isPlaying)
            throw new DMPError(DMPErrors.NOTHING_PLAYING);

        this.queue = queue;

        this.options = Object.assign(
            {} as ProgressBarOptions,
            this.options,
            options
        )

        this.create();
    }

    /**
     * Creates the Progress Bar
     * @private
     */
    private create() {
        if (this.queue.nowPlaying.isLive || !this.queue.nowPlaying.duration) {
            this.bar = '🔴 LIVE';
            return;
        }
        const { size, arrow, block } = this.options;
        const currentTime = this.queue.nowPlaying!.seekTime + this.queue.connection!.time;
        const progress = Math.round((size! * currentTime / this.queue.nowPlaying!.milliseconds));
        const emptyProgress = size! - progress;

        const progressString = block!.repeat(progress) + arrow! + ' '.repeat(emptyProgress);

        this.bar = progressString;
        this.times = `${Utils.msToTime(currentTime)}/${this.queue.nowPlaying!.duration}`;
    }

    /**
     * Progress Bar in a prettier representation
     * @type {string}
     */
    get prettier(): string {
        return `[${this.bar}][${this.times}]`;
    }

    /**
     * Progress Bar in string representation
     * @returns {string}
     */
    toString(): string {
        return this.options.time && this.times ? this.prettier : `[${this.bar}]`;
    }
}

export { ProgressBar };
