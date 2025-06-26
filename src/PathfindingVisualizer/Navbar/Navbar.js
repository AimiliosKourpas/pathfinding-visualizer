import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({
  selectedAlgorithm,
  selectedMaze,
  isVisualizing,
  onAlgorithmChange,
  onMazeChange,
  onVisualize,
  onClear,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('seenHelp')) {
      setShowHelp(true);
      localStorage.setItem('seenHelp', 'true');
    }
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-title">Pathfinding Visualizer</div>

          <div className="dropdown">
            <label htmlFor="algorithm-select">Algorithms:</label>
            <select
              id="algorithm-select"
              value={selectedAlgorithm}
              onChange={onAlgorithmChange}
              disabled={isVisualizing}
            >
              <option value="dijkstra">Dijkstra</option>
              <option value="astar">A*</option>
              <option value="greedy">Greedy Best First</option>
              <option value="swarm">Swarm</option>
              <option value="convergentSwarm">Convergent Swarm</option>
              <option value="bfs">Breadth First Search</option>
              <option value="dfs">Depth First Search</option>
            </select>
          </div>

          <div className="dropdown">
            <label htmlFor="maze-select">Mazes & Patterns:</label>
            <select
              id="maze-select"
              value={selectedMaze}
              onChange={onMazeChange}
              disabled={isVisualizing}
            >
              <option value="">-- Select Maze --</option>
              <option value="recursiveVertical">Recursive Vertical</option>
              <option value="recursiveHorizontal">Recursive Horizontal</option>
              <option value="random">Random</option>
              <option value="stair">Stair</option>
            </select>
          </div>
        </div>

        <div className="navbar-right">
          <button
            className="btn visualize-btn"
            onClick={onVisualize}
            disabled={isVisualizing}
          >
            Visualize
          </button>
          <button
            className="btn clear-btn"
            onClick={onClear}
            disabled={isVisualizing}
          >
            Clear Board
          </button>
          <button
            className="help-btn"
            onClick={() => setShowHelp(true)}
            aria-label="Help"
            title="Help"
            disabled={isVisualizing}
          >
            ?
          </button>
        </div>
      </nav>

      {/* Legend */}
      <div className="legend-container">
        <LegendItem color="green" label="Start Node" />
        <LegendItem color="red" label="Target Node" />
        <LegendItem color="#fff" border label="Unvisited Node" />
        <LegendItem color="#00BEDA" label="Visited Node" />
        <LegendItem color="yellow" label="Shortest-path Node" />
        <LegendItem color="#0C3547" label="Wall Node" />
      </div>

      {/* Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Welcome to Pathfinding Visualizer!</h2>
            <p>You can drag the start and end nodes to reposition them anywhere on the grid.</p>
            <p>Click on the grid cells to add or remove walls and create your own maze.</p>

            <div className="help-legend">
              <LegendItem color="green" label="Start Node" />
              <LegendItem color="red" label="Target Node" />
              <LegendItem color="#0C3547" label="Wall Node" />
            </div>

            <button className="btn close-btn" onClick={() => setShowHelp(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const LegendItem = ({ color, label, border = false }) => (
  <div className="legend-item">
    <div
      className="legend-color-box"
      style={{
        backgroundColor: color,
        border: border ? '1.5px solid #9ca3af' : 'none',
      }}
    />
    <span>{label}</span>
  </div>
);

export default Navbar;
