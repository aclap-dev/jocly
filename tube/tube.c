#include <stdio.h>
#include <math.h>

#define NMAX 10000
#define NRING 100
#define PI (4*atan(1.))

int test, nr, poly, nvert, nuvs, nface, nridge, neye, fcolor = 0xff0000, colorAdjust, startRing, startVert;
double maxh = 0, nod, nodStart, shake;
double height[NRING], radius[NRING], dist[NRING], squeeze[NRING], shift[NRING], slant[NRING], curve[NRING], ridges[NRING], eyes[NRING];
double normH[NRING], normR[NRING];
int paint[NRING];
int noiseV[512], grain[512];
double vertices[3*NMAX], uvs[2*NMAX];
int faces[9*NMAX];

// map stuff
char q[54] = {0102,0115,066,0,014,0,0,0,0,0,066,0,0,0,050,0, 0,0,0,2,0,0,0,2,0,0,1,0,030,0,0,0, 0,0,0,0,014 }; // MS bmp header for 512x512 24-bit
int diffuse[512*512], normal[512*512]; // color data

long long int seed;
int MyRandom()
{
  seed = 90752627 * (seed | 1);
  return (int) (seed >> 16 & 0x7fffffff);
}

double Gaussian()
{
  double res = 0; int i;
  for(i=0; i<12; i++) res += (MyRandom() & 0x1fffff) - 0xfffff;
  return res/(2.*1024*1024);
}

double Noise(int n, double spec[])
{
  double res = 0; int i;
  for(i=0; i<10; i++) res += spec[2*i]*cos(PI*(i+1)*n/208.) +  spec[2*i+1]*sin(PI*(i+1)*n/208.);
}

void MakeWood()
{
  double x, specH[20], specV[20];
  int i, n;
  for(i=0; i<20; i++) {
    specH[i] = Gaussian();
    specV[i] = Gaussian()/(1. + (i>>1)*(i>>1));
  }
  for(i=0; i<416; i++) noiseV[i] = 5*Noise(i, specV);
  for(i=0; i<416; i++) {
    double shift = Noise(i, specH);
    double x = 0.5+0.5*cos(((int)(100*(i+shift+20))%2000)*PI/2000.);
    n = 18*x*x;
    grain[i] = n*0x010100; // yellow
  }
}

double Angle(double x1, double y1, double x2, double y2)
{ // actually the cosine of the angle between the vectos
  double l1 = x1*x1+y1*y1;
  double l2 = x2*x2+y2*y2;
  return (x1*x2 + y1*y2)/sqrt(l1*l2);
}

double Tilt(int n, int which)
{
  double w1 = (n ? dist[n] - dist[n-1] : radius[0]);
  double w2 = dist[n+1] - dist[n];
  double wt = w1 + w2;
  double a, avgH, avgR;
  if(w2/wt < 0.1) w2 = 0; // narrow ridge adapts fully to adhjacent
  if(w1/wt < 0.1) w1 = 0; 
  a = Angle(normH[n], normR[n], normH[n+1], normR[n+1]);
  if(a < 0.6) return 0; // no smoothening if angle isn't blunt enough
  avgH = (normH[n]*w1 + normH[n+1]*w2)/wt; // weighted average of normals
  avgR = (normR[n]*w1 + normR[n+1]*w2)/wt; // ... to which we adapt
  if(which) {
    a = Angle(avgH, avgR, -normR[n+1], normH[n+1]);
  } else {
    a = Angle(avgH, avgR, -normR[n], normH[n]);
  }
  return 127*a;
}

void Ring(int k, int n)
{
  double h = height[k], r = radius[k], d = dist[k], e = squeeze[k], s = shift[k], t = slant[k], Y, Z;
  int i, j, color, first = nvert, fuv = nuvs;
  t *= PI/180.;
  for(i=0; i<n; i++) {
    double x, y, z, dz = 0, phi = 2.*i*PI/n;
    x = e*r*sin(phi); y = -r*cos(phi);
    if(curve[k]) {
      dz = curve[k]*(1. - cos(x/curve[k]));   // apply curve
      x = curve[k]*sin(x/curve[k]);
    }
    z = y*sin(t) - dz*cos(t); y = y*cos(t) + dz*sin(t) ; // apply slant
    vertices[3*nvert] = x;
    vertices[3*nvert+1] = (h - z - nodStart)*cos(nod) + (y + s)*sin(nod) + nodStart;
    vertices[3*nvert+2] = (y + s)*cos(nod) - (h - z - nodStart)*sin(nod);
    uvs[2*nuvs] = ((int) (416*i/poly))/512.;
    uvs[2*nuvs+1] = ((int) (416*d/maxh))/512.;
    if(k != startRing) {
      int u = (i==n-1 ? 1-n : 1);
      faces[nface++] = 9;
      faces[nface++] = first+i-n;
      faces[nface++] = first+i;
      faces[nface++] = first+i+u;
      faces[nface++] = first+i-n+u;
      faces[nface++] = fuv+i-n-1;
      faces[nface++] = fuv+i;
      faces[nface++] = fuv+i+1;
      faces[nface++] = fuv+i-n;
    }
    nvert++; nuvs++;
  }
  uvs[2*nuvs] = 0.8125;
  uvs[2*nuvs+1] = ((int) (416*d/maxh))/512.;
  nuvs++;
  if(k != startRing) {
    int top = d*416/maxh+0.5;
    int bottom = dist[k-1]*416/maxh+0.5;
    int width = 420; // 4 extra pixels
    int gradR = 0, gradG = 0, gradB = 0;
    double t0, t1;
    t0 = Tilt(k-1, 1); t1 = Tilt(k, 0); // tilt at bottom and top edge
    // diffusemap
    color=0xb88b57;
    if(shift[k] == shift[k-1]) {
      if(normH[k] < (!t1 && !t0 ? -0.10 : -0.60)) color = 0x9c7750;
      if(normH[k] < (!t1 && !t0 ? -0.40 : -0.80)) color = 0x846c56, gradR = 3*(color&0xff0000)>>2, gradG = 3*(color&0xff00)<<6, gradB = 3*(color&0xff)<<14;
      if(normH[k] < (!t1 && !t0 ? -0.80 : -0.90)) color = 0x322822, gradR = gradB = gradG = 0;
    }
    color += colorAdjust;
    if(paint[k] & 1<<24) color = paint[k] & 0xffffff; else color += paint[k];
    gradR /= top - bottom; gradG /= top - bottom; gradB /= top - bottom;
    for(j=bottom; j<=top; j++) {
      double r = (radius[k-1]*(top - j) + radius[k]*(j - bottom))/(top - bottom);
      double s = (shift[k-1]*(top - j) + shift[k]*(j - bottom))/(top - bottom);
      double e = (squeeze[k-1]*(top - j) + squeeze[k]*(j - bottom))/(top - bottom);
      for(i=0; i<=width; i++) {
        int z = ((cos(PI*i/208.) + e*sin(PI*i/208.))*r-s)*0.5*208. + 208;
        int c = color - grain[(z+noiseV[j])%416] - ((top-j)*gradR & 0xff0000) - (((top-j)*gradG & 0xff0000)>>8) - (((top-j)*gradB & 0xff0000)>>16);
        if(test) c = ((i-208)%52 ? fcolor : 0xffff00);
        diffuse[512*j+i] = c;
      }
      for(i=421; i<425; i++) diffuse[512*j+i] = fcolor; // section markers
    }
    fcolor ^= 0xffff00;
    // normalmap
    printf("ring %d: (h,r)=(%6.4f,%6.4f) front: (%6.4f,%6.4f) along surface: %6.4f\n",k,h,r,h-r*sin(t),s+r*cos(t),dist[k]);
t0=t1=0;
    for(j=bottom; j<=top; j++) {
      int col = 0x808080; // grey
      double x = 2.*(j-bottom)/(top-bottom) - 1;
      int green = (x*x*0.75 - 0.25)*(t1+t0) + 0.5*x*(t1-t0); // 2nd orde interpolation keeping average 0
      if(green > 127) green = 127;
      col += green << 8 & 0xff00;
      col += sqrt(127*127-green*green) + 0.5;
      for(i=0; i<=width; i++){
        normal[512*j+i] = col;
      }
    }
  }
}

void Cone(int k, int n)
{
  double h = height[k], d = dist[k], e = squeeze[k], s = shift[k];
  int i, j, first = nvert, fuv = nuvs;
  vertices[3*nvert] = 0;
  vertices[3*nvert+1] = h;
  vertices[3*nvert+2] = s;
  nvert++;
  for(i=0; i<n; i++) {
    double x, y, phi = 2.*i*PI/n;
    int u = (i==n-1 ? 1-n : 1);
    x = 0.105*sin(phi); y = -0.105*cos(phi);
    uvs[2*nuvs] = 0.8906 + x;
    uvs[2*nuvs+1] = 0.88906 + y;
    faces[nface++] = 8;
    faces[nface++] = first+i-n;
    faces[nface++] = first;
    faces[nface++] = first+i-n+u;
    faces[nface++] = fuv+i;
    faces[nface++] = fuv+n;
    faces[nface++] = fuv+i+u;
    nuvs++;
  }
  uvs[2*nuvs] = 0.88906;
  uvs[2*nuvs+1] = 0.8906;
  nuvs++;
  printf("cone\n");
  for(i=400; i<512; i++) for(j=400; j<512; j++)
    if((i-456)*(i-456) + (j-456)*(j-456) <= 56*56) {
      diffuse[512*i+j] = 0xb88b57, normal[512*i+j] = 0x8080ff;
    }
}

void ApplyRidge(int n)
{
  double w = ridges[n+1];
  int h = 416*ridges[n]/maxh + 0.5;
  int d = 127*ridges[n+2]/fabs(ridges[n+1]) + 0.5;
  int hw, i, j, f = 1;
  if(w < 0) w = -w, f = 0;
  hw = 208*w/maxh + 0.5;
  if(d > 127) d = 127;
  if(d < -127) d = -127;
  for(j=0; j<=hw; j++) {
    int x = d*f + (1-f)*d*j/hw << 8;
    for(i=0; i<=420; i++) normal[512*(h-j)+i] += x, normal[512*(h+j)+i] -= x;
  }
}

void DrawEyes(int n)
{
  int w = 416*eyes[n+1]/360 + 0.5;
  int h = 416*eyes[n]/maxh + 0.5;
  int d = 208*eyes[n+2]/maxh + 0.5;
  int hw, i, j, f = 1;
  for(j= -d; j<=d; j++) {
    for(i=-d; i<=d; i++) if(i*i + j*j <= d*d) {
      int r = 127*i/d, g = 127*j/d;
      normal[512*(h+j)+208+w+i] += r<<16 | g<<8;
      normal[512*(h+j)+208-w+i] += r<<16 | g<<8;
      diffuse[512*(h+j)+208+w+i] -= 0x404040;
      diffuse[512*(h+j)+208-w+i] -= 0x404040;
    }
  }
}

int main(int argc, char **argv)
{
  char name[200] = "tube.dat", out[200]="", *p = name;
  FILE *f;
  double h, r, u, s, t, c, lift = 0, forward = 0;
  int i, j;
  if(argc > 1) p = argv[1];
  if(argc > 2) if(sscanf(argv[2], "%x", &colorAdjust) != 1) test++;
  f = fopen(p, "r");
  if(!f) { printf("no input file: %s\n", name); return 1; }
  fscanf(f, "%d lift: %lf", &poly, &lift);
  while((fscanf(f, "%lf %lf", &h, &r)) == 2) {
    if(r >= 0) h += lift;
    height[nr] = h; radius[nr] = r;
    if(r < 0) { startRing = ++nr; continue; }
    seed ^= (int) (1000*h);
    u = 1; s = t = c = 0; // default: no squeeze, shift or tilt
    fscanf(f, ": %lf %lf", &u, &s);
    fscanf(f, "; %lf %lf", &t, &c);
    squeeze[nr] = u; shift[nr] = s += forward; slant[nr] = t; curve[nr] = c;
    if(nr != startRing) {
      double x = h - height[nr-1], y = r - radius[nr-1], z = s - shift[nr-1], len;
      if(r) maxh += len = sqrt(x*x + y*y + z*z);
      // calculate normal
      normH[nr] = -y/len; normR[nr] = x/len;
    } else normH[0] = -1; // bottom faces down
    dist[nr++] = maxh;
    if(fscanf(f, " paint: %x", &j) == 1) paint[nr] = j | 1<<24;
    if(fscanf(f, " shade: %x", &j) == 1) paint[nr] = j & 0xffffff;
    if(fscanf(f, " lift: %lf", &h) == 1) lift += h, h = 0, fscanf(f, ", %lf", &h), forward += h;
    if(r <= 0 || u == 0) startRing = nr;
  }

  MakeWood();

  fscanf(f, " out: %s", out);
  while(fscanf(f, " ridge: %lf %lf %lf", ridges+nridge, ridges+nridge+1, ridges+nridge+2) == 3) nridge += 3, printf("ridge\n");
  while(fscanf(f, " eye: %lf %lf %lf", eyes+neye, eyes+neye+1, eyes+neye+2) == 3) neye += 3, printf("eye\n");

  startRing = 0;
  for(i=0; i<nr; i++) {
    double r = radius[i];
    if(r < 0) {
      if(r == -1) poly = height[i]; else
      if(r == -9) nvert = height[i], nuvs = 1000*(height[i] - nvert)+0.5; else
      if(r == -4) nod = PI/180*height[i], nodStart = height[i-1]; else
      if(r < 0) {
        double w = height[i];
        for(j=startVert; j<nvert; j++) vertices[3*j] += w*(r==-3 ? vertices[3*j+2] : 1);
        startVert = nvert;
        for(j=startRing; j<i; j++) Ring(j, poly);
        for(j=startVert; j<nvert; j++) vertices[3*j] -= w*(r==-3 ? vertices[3*j+2] : 1);
      }
    }
    else if(r) Ring(i, poly); else Cone(i, poly);
    if(r <= 0 || squeeze[i] == 0) { startRing = i + 1; startVert = nvert; continue; }
  }
  for(i=0; i<nridge; i+=3) ApplyRidge(i);
  for(i=0; i<neye; i+=3) DrawEyes(i);

  fclose(f);
  f = 0;
  sprintf(name, "%s.js", out);
  if(name[0] != '.') f = fopen(name, "w");
  if(!f) f = stdout;

  fprintf(f, "{\n\t\"metadata\" :\n\t{\n\t\t\"formatVersion\" : 3.1,\n\t\t\"generatedBy\"   : \"HGM's piece creator\",\n");
  fprintf(f, "\t\t\"vertices\"      : %d,\n\t\t\"faces\"         : %d,\n\t\t\"normals\"       : 0,\n\t\t\"colors\"        : 0,\n", nvert, nface/9);
  fprintf(f, "\t\t\"uvs\"           : [%d],\n\t\t\"materials\"     : 0,\n\t\t\"morphTargets\"  : 0,\n\t\t\"bones\"         : 0\n\t\t\n\t},\n", nuvs);
  fprintf(f, "\t\"scale\" : 1.000,\n\t\"materials\" : [],\n\t\t\"vertices\" : [\n");
  for(i=0; i<nvert; i++) fprintf(f, "%5.3f,%5.3f,%5.3f%s\n", vertices[3*i], vertices[3*i+1], vertices[3*i+2], i==nvert-1?"":",");
  fprintf(f, "],\n\n\t\"morphTargets\" : [],\n\t\"normals\" : [],\n\t\"colors\" : [],\n\t\"uvs\" : [[\n");
  for(i=0; i<nuvs; i++) fprintf(f, "%7.6f,%7.6f%s\n", uvs[2*i], uvs[2*i+1], i==nuvs-1?"":",");
  fprintf(f, "]],\n\n\t\"faces\" : [\n");
  for(i=0; i<nface; i++) {
    fprintf(f, "%d%s", faces[i], i==nface-1?"":",");
    if(i%9==8) fprintf(f, "\n");
  }
  fprintf(f, "],\n\t\"bones\" : [],\n\t\"skinIndices\" : [],\n\t\"skinWeights\" : [],\n\t\"animation\" : {}\n\n}\n");
  fclose(f);

  // now flush the maps
  sprintf(name, "%s-diffusemap.bmp", out);
  f = fopen(name, "w");
  for(i=0; i<54; i++) fprintf(f, "%c", q[i]);
  for(i=0; i<512*512; i++) fprintf(f, "%c%c%c", diffuse[i], diffuse[i]>>8, diffuse[i]>>16);
  fclose(f);

  sprintf(name, "%s-normalmap.bmp", out);
  f = fopen(name, "w");
  for(i=0; i<54; i++) fprintf(f, "%c", q[i]);
  for(i=0; i<512*512; i++) fprintf(f, "%c%c%c", normal[i], normal[i]>>8, normal[i]>>16);
  fclose(f);

  return 0;
}

