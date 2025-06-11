// Greedy Best-First Search Implementation
export function greedyBestFirst(grid, startNode, finishNode) {
    const openSet = [];
    const visitedNodesInOrder = [];
  
    startNode.heuristic = manhattanDistance(startNode, finishNode);
    openSet.push(startNode);
  
    while (!!openSet.length) {
      sortNodesByHeuristic(openSet);
      const currentNode = openSet.shift();
  
      if (currentNode.isWall) continue;
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (!openSet.includes(neighbor)) {
          neighbor.heuristic = manhattanDistance(neighbor, finishNode);
          neighbor.previousNode = currentNode;
          openSet.push(neighbor);
        }
      }
    }
  
    return visitedNodesInOrder; // In case no path found
  }
  
  function sortNodesByHeuristic(nodes) {
    nodes.sort((a, b) => a.heuristic - b.heuristic);
  }
  
  function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }
  