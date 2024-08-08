---
id: 33b940ae-ad40-4a70-8510-5d9079531a42
title: Generating Mazes — Andrew Healey
tags:
  - RSS
date_published: 2024-08-08 00:00:00
---

# Generating Mazes — Andrew Healey
#Omnivore

[Read on Omnivore](https://omnivore.app/me/generating-mazes-andrew-healey-191339bcd2f)
[Read Original](https://healeycodes.com/generating-mazes)



* [Andrew Healey](https:&#x2F;&#x2F;healeycodes.com&#x2F;)
* [Articles](https:&#x2F;&#x2F;healeycodes.com&#x2F;articles)
* [Projects](https:&#x2F;&#x2F;healeycodes.com&#x2F;projects)
* [Notes](https:&#x2F;&#x2F;healeycodes.com&#x2F;notes)
* [About](https:&#x2F;&#x2F;healeycodes.com&#x2F;about)
* [GitHub](https:&#x2F;&#x2F;github.com&#x2F;healeycodes)
* [Twitter](https:&#x2F;&#x2F;twitter.com&#x2F;healeycodes)
* [RSS](https:&#x2F;&#x2F;healeycodes.com&#x2F;feed.xml)

I&#39;ve been reading about mazes and how to generate them. The type of mazes I&#39;ll be talking about are 2D grids of connected cells. They&#39;re _perfect mazes_ (i.e. there is exactly one unique path between any two cells aka a uniform spanning tree). I&#39;ll refer to the connections between cells as _edges_. An edge can be created between a cell and any of its neighbors (up, right, left, down). When two cells don&#39;t share an edge, there is a wall between them. While generating a maze, if a cell isn&#39;t reachable, I&#39;ll render it dark.

Left: user-facing maze view. Right: debug view.

A maze begins as a grid of unconnected cells. All dark. When we start connecting the cells, we create the maze.

The above visual was created with the following code.

const maze &#x3D; new Maze(2, 2);

const A &#x3D; maze.getCell(0, 0)

const B &#x3D; maze.getCell(1, 0)

const C &#x3D; maze.getCell(1, 1)

const D &#x3D; maze.getCell(0, 1)

With our new maze, we can start carving edges between the four cells.

A.carveEdge(B)

B.carveEdge(C)

C.carveEdge(D)

Finally, we can pick the two points furthest from each other for the start and end positions. In this case, we pick &#x60;A&#x60; and &#x60;D&#x60;. Later, I&#39;ll explain how to find the two furthest points in any maze.

maze.start &#x3D; A

maze.end &#x3D; D

## Aldous Broder

To automate our maze creation process, we can reach for one of the many [maze generation algorithms](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Maze%5Fgeneration%5Falgorithm). To start, I&#39;ve chosen Aldous Broder because it&#39;s the easiest to code. It uses a random walk-based method to visit every cell, and it&#39;s likely the most frustrating to watch.

Though inefficient (it revisits cells already part of the maze during generation), it creates an unbiased maze. This means that every possible maze of a given size is equally likely to be generated.

You may be able to reverse engineer the algorithm by simply watching the maze generation. To define it very simply: walk around and connect unconnected cells.

const visited &#x3D; new Set&lt;Cell&gt;();

&#x2F;&#x2F; Choose a random starting cell

let current &#x3D; randomMember(maze.cells.flat());

visited.add(current);

&#x2F;&#x2F; While there are unvisited cells

while (visited.size &lt; maze.width * maze.height) {

    &#x2F;&#x2F; From the current cell, choose a random neighbour

    const next &#x3D; shuffle(current.neighbors)[0];

    &#x2F;&#x2F; If the neighbour has not been visited yet

    if (!visited.has(next)) {

        &#x2F;&#x2F; Add an edge and mark as visited

        current.carveEdge(next);

        visited.add(next);

    }

    &#x2F;&#x2F; Move to this neighbour whether or not it was visited

    current &#x3D; next;

}

## Random Depth-First Search

If we don&#39;t like the inefficiency of Aldous Broder, we can use Random Depth-First Search (DFS) to visit each cell once. By stepping from a cell to a random unvisited neighbor, we can traverse the tree.

You may recall that I described Aldous Broder as unbiased. Unfortunately, Random DFS tends to create long corridors due to the path&#39;s tendency to stick to one direction. Perhaps that&#39;s acceptable for your use case.

I&#39;ve chosen the recursive version of this algorithm because I personally find it easier to follow.

const visited &#x3D; new Set&lt;Cell&gt;();

&#x2F;&#x2F; Visit a cell and carve a path to the next cell

async function visit(last: Cell, next: Cell) {

    &#x2F;&#x2F; If the cell has already been visited, skip

    if (visited.has(next)) {

        return;

    }

    &#x2F;&#x2F; Otherwise, mark the cell as visited

    visited.add(next);

    &#x2F;&#x2F; Carve a path between the last cell and the next cell

    last.carveEdge(next);

    &#x2F;&#x2F; Get the neighboring cells of the next cell that haven&#39;t been carved yet

    const neighbors &#x3D; shuffle(next.uncarvedEdges());

    &#x2F;&#x2F; Recursively visit each neighbor

    for (const neighbor of neighbors) {

        await visit(next, neighbor);

    }

}

&#x2F;&#x2F; Start the maze generation by visiting a random neighbor of a random cell

const rndCell &#x3D; randomMember(maze.cells.flat());

await visit(rndCell, shuffle(rndCell.neighbors)[0]);

## Wilson&#39;s Algorithm

If Aldous Broder is inefficient, and Random DFS has a long-corridor bias, then we can choose something in between. Wilson&#39;s Algorithm is unbiased like Aldous Broder, but it doesn&#39;t revisit connected cells.

Wilson&#39;s Algorithm performs a [loop erased random walk](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Loop-erased%5Frandom%5Fwalk). The core loop is this: it starts at an unvisted random cell and randomly walks until it reaches the maze. If, during the walk, a loop is created, then that section of the loop is erased. The initial walk has to reach a random cell.

It tends to start slowly and ramp up.

A little more code is required for this one.

const unvisited &#x3D; new Set&lt;Cell&gt;(maze.cells.flat());

const visited &#x3D; new Set&lt;Cell&gt;();

&#x2F;&#x2F; Choose one cell arbitrarily, add it to the maze, and mark it as visited

const startCell &#x3D; randomMember(maze.cells.flat())

visited.add(startCell);

unvisited.delete(startCell);

&#x2F;&#x2F; Continue until all cells have been visited

while (unvisited.size &gt; 0) {

    let path &#x3D; [];

    let current &#x3D; randomMember(unvisited);

    &#x2F;&#x2F; Perform a random walk until reaching a cell already in the maze

    while (!visited.has(current)) {

        path.push(current);

        let next &#x3D; randomMember(current.uncarvedEdges());

        &#x2F;&#x2F; If a loop is formed, erase that section of the path

        const loopIndex &#x3D; path.indexOf(next);

        if (loopIndex !&#x3D;&#x3D; -1) {

            path &#x3D; path.slice(0, loopIndex + 1);

        } else {

            path.push(next);

        }

        current &#x3D; next;

    }

    &#x2F;&#x2F; Add the path to the maze by carving edges and marking cells as visited

    for (let i &#x3D; 0; i &lt; path.length - 1; i++) {

        const cell &#x3D; path[i];

        const nextCell &#x3D; path[i + 1];

        cell.carveEdge(nextCell);

        visited.add(cell);

        unvisited.delete(cell);

    }

}

I&#39;ve read in a few places that Wilson&#39;s Algorithm is faster than Aldous Broder at generating mazes; I&#39;ve found this to be true in my brief tests. However, I haven&#39;t found this to be proven with any rigor. I also [read](https:&#x2F;&#x2F;news.ycombinator.com&#x2F;item?id&#x3D;2124503) that starting with Aldous Broder and then switching to Wilson&#39;s Algorithm (reasoning: Aldous Broder is slow at the end, Wilson&#39;s Algorithm is slow at the start) is faster than either. However, I haven&#39;t seen proof that this combination still results in a uniform spanning tree (where all possible mazes have equal probability).

## Finding The Two Furthest Points

You may have noticed in these visualizations that the start and end positions (&#x60;S&#x60; and &#x60;E&#x60;) are added once the maze is complete. Usually, start and end positions are placed by the author of a handcrafted maze. They have meaning. For the mazes I’ve been generating, I simply pick the two furthest points.

The strategy for finding the two furthest points involves running two breadth-first searches while tracking the distance from the root cell in each search.

1. Choose a random starting cell &#x60;A&#x60;
2. BFS with &#x60;A&#x60; as root  
   * Mark the furthest point from &#x60;A&#x60; as &#x60;B&#x60;
3. BFS with &#x60;B&#x60; as root  
   * Mark the furthest point from &#x60;B&#x60; as &#x60;C&#x60;
4. The two furthest points are &#x60;B&#x60; and &#x60;C&#x60;

The start and end positions are then chosen randomly from these two points.

Finding the start and end cells via tree diameter.

I suspect there is a way to figure out the start and end positions while also generating a maze. Perhaps not for all of the algorithms we covered. It _feels_ possible.

As for resources, I found most of my jumping off points on the Wikipedia page [Maze generation algorithm](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Maze%5Fgeneration%5Falgorithm). Searching for maze algorithms usually turns up academic resources (with mixed levels of accessibility).

The code for all the visuals and algorithms can be found in the source of this website, specifically in the [mazes directory](https:&#x2F;&#x2F;github.com&#x2F;healeycodes&#x2F;healeycodes.com&#x2F;tree&#x2F;main&#x2F;components&#x2F;visuals&#x2F;mazes). The mazes are rendered with &#x60;&lt;canvas&gt;&#x60; elements.

---

Subscribe to be notified (somewhat irregularly) of my new posts.