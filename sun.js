function mjd(day, month, year, hour) {
  var a, b;
  if (month <= 2) {
    month = month + 12;
    year = year - 1;
  }
  a = 10000.0 * year + 100.0 * month + day;
  if (a <= 15821004.1) b = -2 * Math.floor((year + 4716)/4) - 1179;
  else b = Math.floor(year/400) - Math.floor(year/100) + Math.floor(year/4);
  a = 365.0 * year - 679004.0;
  return (a + b + Math.floor(30.6001 * (month + 1)) + day + hour/24.0);
}

function sin_alt(iobj, mjd0, hour, glong, cglat, sglat) {
  var mjd, t, ra, dec, tau, salt, rads = 0.0174532925;
  var objpos = new Array;
  mjd = mjd0 + hour/24.0;
  t = (mjd - 51544.5) / 36525.0;
  if (iobj == 1) objpos = minimoon(t);
  else objpos = minisun(t);
  ra = objpos[2];
  dec = objpos[1];
  tau = 15.0 * (lmst(mjd, glong) - ra); // hour angle of object
  salt = sglat * Math.sin(rads*dec) + cglat * Math.cos(rads*dec) * Math.cos(rads*tau); // sin(alt) of object using the conversion formulas
  return salt;
}

function frac(x) { //  returns the fractional part of x as used in minimoon and minisun
  var a;
  a = x - Math.floor(x);
  if (a < 0) a += 1;
  return a;
}

function ipart(x) { //  returns the integer part - like int() in basic
  if (x > 0) return Math.floor(x);
  else return Math.ceil(x);
}

function range(x) { //  returns an angle in degrees in the range 0 to 360
  var a, b;
  b = x / 360;
  a = 360 * (b - ipart(b));
  if (a  < 0 ) a = a + 360
  return a
}

function quad(ym, yz, yp) {
  var nz, a, b, c, dis, dx, xe, ye, z1, z2, nz;
  var quadout = new Array;
  nz = 0;
  a = 0.5 * (ym + yp) - yz;
  b = 0.5 * (yp - ym);
  c = yz;
  xe = -b / (2 * a);
  ye = (a * xe + b) * xe + c;
  dis = b * b - 4.0 * a * c;
  if (dis > 0)  {
    dx = 0.5 * Math.sqrt(dis) / Math.abs(a);
    z1 = xe - dx;
    z2 = xe + dx;
    if (Math.abs(z1) <= 1.0) nz += 1;
    if (Math.abs(z2) <= 1.0) nz += 1;
    if (z1 < -1.0) z1 = z2;
  }
  quadout[0] = nz;
  quadout[1] = z1;
  quadout[2] = z2;
  quadout[3] = xe;
  quadout[4] = ye;
  return quadout;
}

function lmst(mjd, glong) {
  var lst, t, d;
  d = mjd - 51544.5
  t = d / 36525.0;
  lst = range(280.46061837 + 360.98564736629 * d + 0.000387933 *t*t - t*t*t / 38710000);
  return (lst/15.0 + glong/15);
}

function minisun(t) {
  var p2 = 6.283185307, coseps = 0.91748, sineps = 0.39778;
  var L, M, DL, SL, X, Y, Z, RHO, ra, dec;
  var suneq = new Array;
  M = p2 * frac(0.993133 + 99.997361 * t);
  DL = 6893.0 * Math.sin(M) + 72.0 * Math.sin(2 * M);
  L = p2 * frac(0.7859453 + M / p2 + (6191.2 * t + DL)/1296000);
  SL = Math.sin(L);
  X = Math.cos(L);
  Y = coseps * SL;
  Z = sineps * SL;
  RHO = Math.sqrt(1 - Z * Z);
  dec = (360.0 / p2) * Math.atan(Z / RHO);
  ra = (48.0 / p2) * Math.atan(Y / (X + RHO));
  if (ra <0 ) ra += 24;
  suneq[1] = dec;
  suneq[2] = ra;
  return suneq;
}

function find_sun_for_date(mjd, tz, glong, glat) {
  var sglong, sglat, cglat, date, ym, yz, above, utrise, utset, j, xe, ye;
  var yp, nz, rise, sett, hour, z1, z2, iobj, rads = 0.0174532925;
  var quadout = new Array;
  var sinho = new Array;
  sinho[0] = Math.sin(rads * -0.833); 
  sglat = Math.sin(rads * glat);
  cglat = Math.cos(rads * glat);
  date = mjd - tz/24;
  for (j = 0; j < 1; j++) {
    rise = false;
    sett = false;
    above = false;
    hour = 1.0;
    ym = sin_alt(2, date, hour - 1.0, glong, cglat, sglat) - sinho[j];
    if (ym > 0.0) above = true;
    while(hour < 25 && (sett == false || rise == false)) {
      yz = sin_alt(2, date, hour, glong, cglat, sglat) - sinho[j];
      yp = sin_alt(2, date, hour + 1.0, glong, cglat, sglat) - sinho[j];
      quadout = quad(ym, yz, yp);
      nz = quadout[0];
      z1 = quadout[1];
      z2 = quadout[2];
      xe = quadout[3];
      ye = quadout[4];
      if (nz == 1) {
        if (ym < 0.0) {
          utrise = hour + z1;
          rise = true;
        }
        else {
          utset = hour + z1;
          sett = true;
        }
      } 
      if (nz == 2) {
        if (ye < 0.0) {
          utrise = hour + z2;
          utset = hour + z1;
        }
        else {
          utrise = hour + z1;
          utset = hour + z2;
        }
      }
      ym = yp;
      hour += 2.0;
    } 
  } 
	return {rise: utrise,set: utset}
}

