// A* Search Algorithm Implementation
export function astar(grid, startNode, finishNode) {
    const openSet = [];
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristic = manhattanDistance(startNode, finishNode);
    startNode.totalCost = startNode.heuristic;
    openSet.push(startNode);
  
    while (!!openSet.length) {
      sortNodesByTotalCost(openSet);
      const currentNode = openSet.shift();
  
      // If we encounter a wall, skip it.
      if (currentNode.isWall) continue;
  
      // If we've reached the destination, we're done.
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        const tentativeG = currentNode.distance + 1;
        if (tentativeG < neighbor.distance) {
          neighbor.distance = tentativeG;
          neighbor.heuristic = manhattanDistance(neighbor, finishNode);
          neighbor.totalCost = neighbor.distance + neighbor.heuristic;
          neighbor.previousNode = currentNode;
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  
    return visitedNodesInOrder; // In case no path found
  }
  
  function sortNodesByTotalCost(nodes) {
    nodes.sort((a, b) => a.totalCost - b.totalCost);
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
  