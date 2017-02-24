(function(grow){
  grow = grow || {};
  grow.ui = grow.ui || {};
  grow.ui.tools = grow.ui.tools || [];

  var overlayEl = null;
  var grids = [];
  var config;

  var applyGridDefaults = function(grid) {
    grid.cols = grid.cols || 12;
    return grid
  };

  var createStyles = function(grid) {
    var styles = '';
    var colWidth = (grid.width - (grid.gutter * (grid.cols - 1))) / grid.cols;
    var prefix = '.grow_tool__grid__grid--' + grid.cols + ' ';

    styles += prefix + '{ display: flex; max-width: ' + grid.width + 'px; }\n';
    styles += prefix + '.grow_tool__grid__gutter { width: ' + grid.gutter + 'px; }\n';
    styles += prefix + '.grow_tool__grid__column { width: ' + colWidth + 'px; }\n';

    // Handle breakpoints.
    if (grid.breakpoint || grid.breakpoint_max) {
      var boundaries = [];
      if (grid.breakpoint) {
        boundaries.push('min-width: ' + grid.breakpoint + 'px');
      }
      if (grid.breakpoint_max) {
        boundaries.push('max-width: ' + grid.breakpoint_max + 'px');
      }
      styles = '@media (' + boundaries.join(' and ') + ') {\n' + styles + '}\n';
    }

    return styles;
  };

  var createOverlay = function() {
    overlayEl = document.createElement('div');
    overlayEl.classList.add('grow_tool__grid__overlay');

    // Create unique grids for each grid col count.
    var gridCols = [];
    for (var j = 0; j < grids.length; j++) {
      var grid = grids[j];
      if (gridCols.indexOf(grid.cols) < 0) {
        gridCols.push(grid.cols);
        var gridEl = document.createElement('div');
        gridEl.classList.add('grow_tool__grid__grid');
        gridEl.classList.add('grow_tool__grid__grid--' + grid.cols);

        for (var i = 0; i < grid.cols; i++) {
          var colEl = document.createElement('div');
          colEl.classList.add('grow_tool__grid__column');
          gridEl.appendChild(colEl);

          if (i < grid.cols - 1) {
            var gutterEl = document.createElement('div');
            gutterEl.classList.add('grow_tool__grid__gutter');
            gridEl.appendChild(gutterEl);
          }
        }
        overlayEl.appendChild(gridEl);
      }
    }
    document.body.appendChild(overlayEl);
  };

  var triggerTool = function() {
    if (!overlayEl) {
      createOverlay();
    } else {
      overlayEl.classList.toggle('grow_tool__grid__overlay--hidden');
    }
  };

  var init = function(options) {
    config = options || {};

    if (config.grids) {
      for (var i = 0; i < config.grids.length; i++) {
        grids.push(applyGridDefaults(config.grids[i]));
      }

      var styleEl = document.createElement('style');
      styleEl.type = 'text/css';

      var styles = '';
      for (var i = 0; i < grids.length; i++) {
        styles += createStyles(grids[i]);
      }

      if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = styles;
      } else {
        styleEl.appendChild(document.createTextNode(styles));
      }
      document.body.appendChild(styleEl);
    }
  };

  grow.ui.tools.push({
    'kind': 'grid',
    'name': 'Grid Overlay',
    'button': {
      'events': {
        'click': triggerTool
      }
    },
    'init': init
  });
})(grow || window.grow);
