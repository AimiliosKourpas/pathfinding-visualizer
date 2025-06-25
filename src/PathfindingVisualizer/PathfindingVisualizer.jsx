import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra.js';
import { astar } from '../algorithms/astar';
import { greedyBestFirst } from '../algorithms/greedyBestFirst';
import { swarm } from '../algorithms/swarm'; // adjust path if needed
import { convergentSwarm } from '../algorithms/convergentSwarm';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';



import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      draggingStart: false,
      draggingFinish: false,
      startNodeRow: 10,
      startNodeCol: 15,
      finishNodeRow: 10,
      finishNodeCol: 35,
    };
  }

  componentDidMount() {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const grid = getInitialGrid(startNodeRow, startNodeCol, finishNodeRow, finishNodeCol);
    this.setState({ grid });
  }
  

  handleMouseDown(row, col) {
    const node = this.state.grid[row][col];
  
    if (node.isStart) {
      this.setState({ draggingStart: true });
    } else if (node.isFinish) {
      this.setState({ draggingFinish: true });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  
    this.setState({ mouseIsPressed: true });
  }
  
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const { draggingStart, draggingFinish, grid } = this.state;
  
    if (draggingStart) {
      const { grid: newGrid } = moveSpecialNode(grid, row, col, 'start');
      this.setState({
        grid: newGrid,
        startNodeRow: row,
        startNodeCol: col,
      });
    } else if (draggingFinish) {
      const { grid: newGrid } = moveSpecialNode(grid, row, col, 'finish');
      this.setState({
        grid: newGrid,
        finishNodeRow: row,
        finishNodeCol: col,
      });
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid });
    }
  }
  
  
  handleMouseUp() {
    this.setState({ mouseIsPressed: false, draggingStart: false, draggingFinish: false });
  }
  

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  

  visualizeAstar() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  
  visualizeGreedy() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = greedyBestFirst(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  
  visualizeSwarm() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = swarm(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  
  visualizeConvergentSwarm() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = convergentSwarm(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  

  visualizeBFS() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  
  visualizeDFS() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearGrid() {
    const newGrid = this.state.grid.map(row =>
      row.map(node => {
        return {
          ...node,
          isVisited: false,
          distance: Infinity,
          totalCost: Infinity,
          previousNode: null,
          isPath: false,
          isWall: false, // Clear walls too

        };
      })
    );
  
    for (let row of newGrid) {
      for (let node of row) {
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (!element) continue;
  
        if (node.isStart) {
          element.className = 'node node-start';
        } else if (node.isFinish) {
          element.className = 'node node-finish';
        } else if (node.isWall) {
          element.className = 'node node-wall';
        } else {
          element.className = 'node';
        }
      }
    }
  
    this.setState({ grid: newGrid });
  }
  
  
  
  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's Algorithm</button>
        <button onClick={() => this.visualizeAstar()}>Visualize A* Algorithm</button>
        <button onClick={() => this.visualizeGreedy()}>Visualize Greedy Best-First Search</button>
        <button onClick={() => this.visualizeSwarm()}>Visualize Swarm Algorithm</button>
        <button onClick={() => this.visualizeConvergentSwarm()}>Visualize Convergent Swarm</button>
        <button onClick={() => this.visualizeBFS()}>Visualize Breadth-First Search</button>
        <button onClick={() => this.visualizeDFS()}>Visualize Depth-First Search</button>
        <button onClick={() => this.clearGrid()}>Clear Board</button>

      
        
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = (startRow, startCol, finishRow, finishCol) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, startRow, startCol, finishRow, finishCol));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, startRow, startCol, finishRow, finishCol) => {
  return {
    col,
    row,
    isStart: row === startRow && col === startCol,
    isFinish: row === finishRow && col === finishCol,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};


const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const moveSpecialNode = (grid, newRow, newCol, type) => {
  const newGrid = grid.map(row =>
    row.map(node => {
      if (type === 'start' && node.isStart) {
        return { ...node, isStart: false };
      } else if (type === 'finish' && node.isFinish) {
        return { ...node, isFinish: false };
      }
      return node;
    })
  );

  newGrid[newRow][newCol] = {
    ...newGrid[newRow][newCol],
    isStart: type === 'start',
    isFinish: type === 'finish',
    isWall: false,
  };

  return { grid: newGrid };
};
