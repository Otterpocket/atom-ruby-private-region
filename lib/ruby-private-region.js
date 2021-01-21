'use babel';

import RubyPrivateRegionView from './ruby-private-region-view';
import { CompositeDisposable } from 'atom';

export default {

  rubyPrivateRegionView: null,
  subscriptions: null,

  activate(state) {
    this.rubyPrivateRegionView = new RubyPrivateRegionView(state.rubyPrivateRegionViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ruby-private-region:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    // nothing here yet
  },

  serialize() {
    return {
      rubyPrivateRegionViewState: this.rubyPrivateRegionView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      buffer = editor.getBuffer();
      buffer.backwardsScan(/^ *private$/, (found) => {
        if (found.match[0]) {
          found.stop();
          start_range = found.range.start;
          range = [start_range ,[Number.POSITIVE_INFINITY,0]];
          marker = editor.markBufferRange(range);
          decoration = editor.decorateMarker(marker, {type: 'line-number', class: 'ruby-private-region'});
        }
      });
    }
  }
};
