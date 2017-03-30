
**Warning: This is work in progress, APIs are subject to changes 
until Jocly is released as version 1.0.0**

Jocly is a library and set of tools to integrate boards games into Web environments.
It comes with a large collection of abstract strategy games, 2D and 3D user interface,
artificial intelligence to play against.

Demos
-----

Simple human vs computer:

[Classic chess](https://mi-g.github.com/jocly/examples/browser/simple.html?classic-chess),
[Circular chess](https://mi-g.github.com/jocly/examples/browser/simple.html?circular-chess),
[Multi layers chess](https://mi-g.github.com/jocly/examples/browser/simple.html?raumschach),
[Hexagonal chess](https://mi-g.github.com/jocly/examples/browser/simple.html?glinski-chess),
[Chinese chess](https://mi-g.github.com/jocly/examples/browser/simple.html?xiangqi),
[Middle-age chess](https://mi-g.github.com/jocly/examples/browser/simple.html?courier-chess),
[Scrum](https://mi-g.github.com/jocly/examples/browser/simple.html?scrum)

Or see and try [all available games](https://mi-g.github.com/jocly/examples/browser/multiple.html)

Building
--------

- install the *node.js* environment (using [nvm](https://github.com/creationix/nvm) is probably a good idea)
- install *gulp*: `npm install -g gulp`
- install [git](https://git-scm.com/downloads)
- clone Jocly from *github*: `git clone https://github.com/mi-g/jocly.git`
- enter the `jocly` directory
- download required modules: `npm install`
- build: `gulp build`
- `dist/browser` contains the javascript library to build web applications, `dist/node` is the module to be used for node.js applications

Using Jocly in a Web page
-------------------------

After building Jocly, copy the `dist/browser` directory as `jocly` into your project filesystem.

Insert this line to your HTML source code:
````
<script src="jocly/jocly.js"></script>
````

You are now ready to use the Jocly API through the `Jocly` global object.

API Documentation
-----------------

This section is to be written. For now, check the examples into the `examples/browser` 
and `examples/node` sub-directories.
