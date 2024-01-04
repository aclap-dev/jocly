'tube' is a command-line tool for facilitating creation of
3d pieces for Jocly, for those that don't want to use fancy
design programs like Blender. It can be compiled with the
command 'gcc tube.c -o tube -lm'.

Basics

A Jocly 3d image for piece xxx consists of three files: xxx.js,
xxx-diffusemap.jpg and xxx-normalmap.jpg. The .js file contains
the 'mesh': lists of point coordinates that define the 3d shape
('vertices'), lists of coordinates of points in the map files
to cut out part of these and paint it on the surface of the 3d
object ('uvs'), and a list of vertex and uv numbers to indicate
how these points are connected to form triangles and quadrangles
('faces').
  The diffusemap is an image file in true colors, which will be
used to paint the faces of the 3d object as specified by the
uvs. Jocly might manipulate the colors, e.g. to create black
versions of the piece, and account for light/shadow effects.
  The normalmap is an image that controls the direction of
reflections relative to the surface, encoded in false colors.
This is used to create the illusion of height variations on
faces that are really flat. The neutral color is light blue,
for indicating a flat surface. But Jocly manipulates this
such that adjacent faces that do not make an acute angle
appear curved such that they seemlessly fit together.
This way the Pawns head, which in vertical cross section is
just a hexagon, reflects light as if it is a perfect sphere.

The Tube tool creates 3d objects as a sequence of 'rings',
with equal number of points along their circumference.
Corresponding points of adjacent rings are connected to
form quadrangular faces, to make a (cylindrical or conical)
tube 'section'. The entire series of rings thus defines a
tube of variable diameter.
  The lower and left 81% of the map files (which always are
512x512 images) represent this tube surface, and wraps
around such that left and right edges connect. A red/green
scale to the right of this area in the diffusemap indicates
which part of the map corresponds to which tube section.
This can be useful when you want to edit the image (e.g.
with Gimp or MS Paint) for painting details on it.

One of the sections can be a cone, where a single point
(the top) connects to all points of the preceding ring,
to form triangular faces. A disk in the upper right of the
maps is used to color this cone. This facility is mainly
offered in case you want to paint something on a nearly
flat top, which would be highly distorted if you would
have described it as a tube section with one of the ends
invisibly narrow.

Design cycle

The Tube tool takes its input from a file specified in
the command line, e.g.

tube piece.dat

Running this would create the .js file, and both maps
in .bmp (Windows bitmap) format. The latter then have
to be converted to .jpg by commands like

convert piece-normalmap.bmp piece-normalmap.jpg

on Linux. (On Windows I would know no other way to do it
than loading the .bmp in MS Paint, and then saving again
in .jpg format.)

We can then copy the .js and .jpg files to the directory
of a piece in the Jocly library, e.g. to

jocly/dist/browser/games/chessbase/res/staunton/rook/

calling them rook.js etc., overwriting the original rook.
(It would be easiest to put these commands for conversion
and copying into a shell script, as you will run the
combination of commands many times.) This replaces the 3d
rook image by your piece. By letting Jocly then run normal
Chess you would then see that piece appear on the corner
squares, where you can examine it in close up to see how
you are doing.

To better judge which ring needs adjustment, you can run
the tube command with an extra parameter 't':

tube piece.dat t

This will cause the sections to be alternately colored
bright green and red. Normally they would be painted in
a nice wood-grain pattern. It is recommended to rn with
this extra t until you are satisfied with the design, and
then drop it to get normal colors. This only affects the
diffusemap that is produced.

The input format

The input file starts with an integer to indicate the number
of points along the circumference. Usually 16 is sufficient.
(More points gives better quality, but makes Jocly slower.)
Then follows a list of height-radius pairs describing the
rings, as whitespace-separated real numbers. The total
height of Jocly pieces is typically 3.0 - 3.5, while a
radius 1.0 extends nearly to the edge of the square.
  It is usually good practice to put each  ring on a
separate line, so you can easily see which numbers are
heights, and which radii.

Simple case: cylinder symmetry

To create a cylindrically symmetric piece you only have
to specify the height and radius of all the rings, which
by default are each in a horizontal plane. The list must
be followed by a specification of the output filenames,
or it would be printed on the terminal. E.g.:

16
0.000 0.700
0.050 0.700
0.500 0.500
0.860 0.860
1.360 1.000
1.860 0.860
2.220 0.500
2.360 0
out: sphere

This would describe a (rather course) sphere on a pedestal.
The sphere in this case encompasses the top 5 sections;
6 sections is about the minimum for a full sphere, but the
lowest slice is replaced by the pedestal here.
  Running Tube on this input will produce files sphere.js,
sphere-diffusemap.bmp and spere-normalmap.bmp, which you
then convert and copy to Jocly. Congratulations! You now
created your first piece.

Surface details

After the specification of the output file you can still
specify some details to be drawn on the maps: ridges and
eyes. These don't affect the mesh file, but can create
the illusion of extra structure.
  A 'ridge' is drawn all around the object, parallel to
the rings. There are two kind of ridges: V-shaped and U-
shaped. To get one we have to write a line

ridge: height width depth

where the latter three are real numbers. The height is
tricky as it does not correspond directly to the height
at which you defined the rings, but is measured along
the surface. This to be able to distinguish location
on tube sections that are (nearly) horizontal, or even
hanging down, (like the brim of a hat) so that the same
height is passed multiple times.
  To facilitate this, running tube will print a list of
the rings, with the 'height along the surface' in the
last column. You can use that as an aid to position the
ridges.
  The depth is positive for ridges lying on the surface,
and negative for grooves. With positive width the ridge
is V-shaped, with negative width it will be U-shaped.
  There is a trick to optically soften acute angles
between sections (which Jocly would not do automatically):
You can put a V-shaped groove exactly at the connection
to 'neuralize' the angle (like you shaved if off), and
then an equally wide U-shaped ridge on top of that.

Eyes are round, darkened pits. They are specified
through a line

eye: height angle size

where 'height' is again the height measured along the
surface. The 'angle' parameter specifies the horizontal
location on the surface, as the angle with the forward
direction (in degrees). So 60 would mean looking a bit
forward but mostly sideways. Eyes are always created
in symetrically-positioned pairs.
  The eyes are drawn as circles on the maps, but because
the maps can be highly distorted when transfered to the
surface of the tube (depending on the local diameter
and total height), they might show up elongated.

It is possible to specify a different color for a tube
section. To this end you must write behind the spec
of the ring that finishes it

paint: color

or

shade: color

where 'color' is a hexadecimal color number (e.g. ff000
for red). The difference is that 'paint' sets the color
to the given one, while 'shade' will use the latter as
an offset to add to the color it would normally generate.
(Such that 101010 would make it a bit lighter, and
f0f0f0 a bit darker.) This would preserve the wood-
grain pattern in the section.
  Note that it is possible to adjust the color of the
entire object by specifying such a color offset on
the command line as the 2nd argument.

With these techniques you should already be able to
produce pieces like they could be made out of turned
wood with a laith. The lower part of pieces usually
look very much alike, and once you have a satisfacory
representation of that you can use it for creating
multiple pieces by just putting different heads and
hats on it.
  Note that the .js file contains an over-all scaling
factor, which by default is set to 1. By editing the
file afterwards you could change that to shrink or
expand the piece. So if your design turns out too
tall after making all necessary adjustments to get the
right shape, there is no need to change all the input
numbers; you just change the scale. (Contrary to
intuition larger scale makes the piece smaller.)

Creating (modest) asymmetry

For pieces that are mostly cylindrically symmetric, but
have parts that stick out in one horizontal direction
at some heights (such as the vizor of the Champion or
the cap of the generals), we can shift some of the rings
off axis by following the height-radius pair for that
ring by a colon and two more real numbers. The first of
these indicates the elliptic distortion of the ring: the
width is multiplied by it. This causes indentation or
protrusion in two diametrically opposit directions,
either sideways of forward-backward. When the number is
1 it has no effect, and the ring remains circular.
Otherwise cylinder symmetry is broken, but the piece
still has forward-backward mirror symmetry.

The second number is the forward shift, in the same
units as the radius. This causes a forward-backward
asymmetry. To make the piece bulge out on one side
you would specify a larger ring than the adjacent ones,
but specify a shift equal to the increase in radius,
so that one side stays in line with the other rings,
and the opposit side bulges out twice as much.
To prevent the larger radius makes the piece bulge
out sideways too much, you can compensate the radius
increase by specifying an ellipticity < 1.


Bending

So far all rings would be perfectly horizontal. It
is possible to deviate from that by following the
height-radius pair with a semicolon and two more
real numbers. This can be done even after you specified
an ellipticity & shift with the aid of a colon (but
not before that!).
  The first number indicates the (forward) tilt of the
ring plane, as an angle in degrees. So 90 would make
the ring stand up vertically, where what formerly was
the front of the piece now points down. The center
of the ring would stay on the vertical axis, so you
would usually combine this with a forward shift to
create a bended tube. To get a smooth bend you would
of course need many intermediate angles, increasing
the tilt in steps of maximally 15 degrees.
  The second number is the 'up-curve' distortion.
It bends the plane of the ring into a horizontal
cylinder with a forward-pointing axis, like the ring
is 'smiling'. This is done before applying any tilt.
The number represents the radius of this cylinder.
So to bend the ring into half a circle you would have
to make that about 65% of the ring radius. This
feature is not often needed; it was added for making
the wings of the Phoenix, where a very narrow
sideway ellipse is bent upwards.

Giving an occasional ring a small tilt has an effect
that is barely distinguishable from making it elliptic.
So the tilt is mainly used to bend the tube that
defines the piece in small steps to a large angle
with the vertical, perhaps even inverting direction
and grow downward again (such as in the Stork).
  Because tilt and shift have to be combined to make
the rings connect in a natural way, it is usually
a pain to get this right. Especially on very tight
curves of the tube. As an aid Tube not only prints
the height-radius pairs, but also the coordinates
of the forward-most point in each ring. This can
tell you how much you have to adjust it horizontally
and vertically to make the front of the piece curve
in a smooth way.
  This is not so helpful when you bend the tube
backwards, so that the backward-most points get
critically close together. But in that case you can
first design the mirrored version that does bend
forwards, and then flip the sign of all horizontal
shifts and tilt angles.

The 'lift' directive

Sometimes you get something that looks like you want
it, except that some section is too short. E.g. a
piece with a complex hat, and you think the body should
be just a bit taller. Of course you can increase the
height coordinates in all rings above the top of the
body by an equal amount to shift the head up, and
repeat that until you get it right. But by putting a line

lift: h,f

with h and (optionally) f real numbers between the ring
specifications you will shift all rings specified after
it up by h, and forward by f. That makes positioning the
upper part of a design much easier.
  Lift directives are cumulative: the adjustment of
height and forward shift of the specified rings always
equals the sum of all preceding lift directives.

Pseudo-rings

Negative radii would make no sense, and the Tube program
uses these as a kludge for changing some of its settings
during the generation of the tube. In this case the
parameter that normally indicates the height is interpreted
for a different purpose. The actual (negative) value of the
radius indicates which purpose.
  Any negative radius terminates the tube we have generated
so far, and makes the ring that follows start a new,
disconnected tube. This way we can create multiple tubes.
  When the radius = -1, the first parameter indicates the
new number of points along the circumference to be used for
all rings of the next tube.

  When radius = -2, the tube that was just completed is
duplicated. The first parameter in that case indicates how
much the two instances will be shifted to the left and
right. This is useful for making ears or horns.
  When radius = -3, the latest tube is also duplicated.
But in this case the instances are separated by applying
a shear transformation, which shift each point by an amount
that grows as we get further from the left-right plane: the
forward-backward coordinate of a point is multiplied by the
first parameter, and the result is added to or subtracted
from the left-right coordinate. This can be used to 'unfold'
wing structures.

  When radius = -4, the first parameter represents an angle
(in degrees). The whole structure that follows is then
rotated by that angle around an axis that runs left-to-right,
at the height of the last ring in the previous tube. This
is the angular equivalent of the lift command, but unlike
the latter can only occur once.


