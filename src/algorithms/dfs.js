export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const stack = [];
  
    stack.push(startNode);
  
    while (stack.length > 0) {
      const currentNode = stack.pop();
  
      if (currentNode.isWall || currentNode.isVisited) continue;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      }
    }
  
    return visitedNodesInOrder;
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }
  