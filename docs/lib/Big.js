///////////////////////////////////////////////////////////////
//  Big.js
//  v0.8.0 (beta)
///////////////////////////////////////////////////////////////
//  http://github.com/whatgoodisaroad/Big-js
//  By Wyatt Allen
//  MIT Licensed
//  Tuesday, July 27 2010
///////////////////////////////////////////////////////////////
var Big;

(function() { 
  var 
    // Expression for parseable strings.
    valid = /^[\+\-]?(\d*(\.\d*)?)$/,

    // Internal Cosnstants.
    POSITIVE = false,
    NEGATIVE = true;

  // The Big constructor.
  Big = function(str) {
    str = trim(str);
    
    if (!valid.test(str)) {
      throw "Format exception: \"" + str + "\"";
    }
    
    // Handle a sign in the string.
    this.sign = POSITIVE;
    
    if (/^[\+\-]/.test(str)) {
      if (str[0] == "-") {
        this.sign = NEGATIVE;
      }
      
      str = str.substring(1);
    }

    // If the string does not have a decimal point.
    if (str.indexOf(".") == -1) {
      this.whole = str;
      this.fractional = "0";
    }

    // If the string starts with the decimal point.
    else if (str[0] == ".") {
      this.whole = "0";
      this.fractional = str.substring(1);
    }
    
    // If the string ends in a decimal point.
    else if (str[str.length - 1] == ".") {
      this.whole = str.substring(0, str.length - 1);
      this.fractional = "0";
    }
    
    // Else the decimal point is somewhere in the string.
    else {
      var dec = str.split(".");
      this.whole = dec[0];
      this.fractional = dec[1];
    }
    
    // Constructing zero should always be positive.
    if (trim(this.whole + this.fractional) == "") {
      this.sign = POSITIVE;
    }
  }
  
  // Global constants.
  Big.POSITIVE = POSITIVE;
  Big.NEGATIVE = NEGATIVE;
  
  Big.parse = function(str) {
    return new Big(str);
  };

  // Prototype Methods;
  ///////////////////////////////////////////////////////
  
  Big.prototype.lessThan = function(right) {
    return inequal("lessThan", this, right);
  };
  
  Big.prototype.greaterThan = function(right) {
    return inequal("greaterThan", this, right);
  };
  
  Big.prototype.equals = function(right) {
    return equal(this, right);
  };
  
  Big.prototype.lessThanOrEqualTo = function(right) {
    return inequal("lessThan", this, right) || equal(this, right);
  };
  
  Big.prototype.greaterThanOrEqualTo = function(right) {
    return inequal("greaterThan", this, right) || equal(this, right);
  };
  
  Big.prototype.plus = function(right) {
    return add(this, right);
  };
  
  Big.prototype.minus = function(right) {
    return subtract(this, right);
  };
  
  Big.prototype.toString = function() {
    if (this.isZero()) {
      return "0.0";
    }
    else {
      return [ this.sign == NEGATIVE ? "-" : "", triml(this.whole), ".", trimr(this.fractional) ].join("");
    }
  };
  
  Big.prototype.isZero = function() {
    return trim(this.whole) == "" && trim(this.fractional) == "";
  };
  
  Big.prototype.clone = function() {
    return new Big(this.toString());
  };
  
  // Negate does not modify.
  Big.prototype.negate = function() {
    var ret = this.clone();
    
    ret.sign = !ret.sign;
    
    return ret;
  };
  
  // Internal Mathematics Functions:
  ///////////////////////////////////////////////////////

  // Test whether two Big objects are equal.
  function equal(left, right) {
    if (left.isZero() && right.isZero()) {
      return true;
    }
    
    if (left.sign != right.sign) {
      return false;
    }
    
    // Pad the whole and fractional components and then check
    // string equality. Find the max width of both for padding.
    
    var wholeNorm = Math.max(
      left.whole.length,
      right.whole.length
    );
    
    var fractionalNorm = Math.max(
      left.fractional.length,
      right.fractional.length
    );
    
    return (
      padLeft(left.whole, wholeNorm) == padLeft(right.whole, wholeNorm) && 
      padRight(left.fractional, fractionalNorm) == padRight(right.fractional, fractionalNorm)
    );
  }
  
  // Do a math inequality check on two Big objects.
  function inequal(type, left, right) {
    if (type == "lessThan") {
      var a = -1, b = 1;
      
      // If the signs are not the same, 
      // return whether the left is the negative one.
      if (left.sign != right.sign) {
        return left.sign == Big.NEGATIVE;
      }
    }
    else if (type == "greaterThan") {
      var a = 1, b = -1;
      
      // If the signs are not the same,
      // return whether the left is the positive one.
      if (left.sign != right.sign) {
        return left.sign == Big.POSITIVE;
      }
    }
    else {
      throw "Bad argument in inequal";
    }
    
    // If the signs are negative negate both expectatons.
    if (left.sign == Big.NEGATIVE) {
      a = -a;
      b = -b;
    }
    
    var wholeNorm = Math.max(
      left.whole.length,
      right.whole.length
    );
    
    var 
      lw = padLeft(left.whole, wholeNorm),
      rw = padLeft(right.whole, wholeNorm);
    
    var comp = strcmp(lw, rw);
    
    // Expectation was proven correct in the whole component.
    if (comp == a) {
      return true;
    }
    
    // Expectation was proven incorrect in the whole component.
    else if (comp == b) {
      return false;    
    }
    
    // The whole components are equal.
    // Evaluate the fractional components.
    else {
      var fractionalNorm = Math.max(
        left.fractional.length,
        right.fractional.length
      );
      
      var 
        lf = padRight(left.fractional, fractionalNorm),
        rf = padRight(right.fractional, fractionalNorm);
      
      // Return whether the left fractional component
      // is the larger of the two.
      return strcmp(lf, rf) == a;
    }
  }
  
  // Add two Big objects together.
  function add(left, right) {
    
    // If the signs are not the same. 
    // This is actually a subtraction problem.
    if (left.sign != right.sign) {
      if (left.sign == NEGATIVE) {
        return subtract(right, left.negate());
      }
      else {
        return subtract(left, right.negate());
      }
    }
    
    // The signs are equal (pure addition).
    else {

      var negate = false;
      
      // If the signs are both negative then the result will
      // be negaive.
      if (left.sign == NEGATIVE) {
        negate = true;
      }
    
      var fractionalNorm = Math.max(
        left.fractional.length,
        right.fractional.length
      );
      
      // Add the fractional components.
      var fractionalSum = addStrings(
        padRight(left.fractional, fractionalNorm), 
        padRight(right.fractional, fractionalNorm)
      );
      
      // Extract the carry over from the fractional sum (if any).
      var fractionalCarry;
      
      if (fractionalSum.length > fractionalNorm) {
        fractionalCarry = parseInt(
          fractionalSum.substring(
            0, 
            fractionalSum.length - fractionalNorm
          )
        );
        
        fractionalSum = fractionalSum.substring(1);
      }
      else {
        fractionalCarry = 0;
      }
      
      // Add the whole componens with the carry.
      var wholeNorm = Math.max(
        left.whole.length,
        right.whole.length
      );
      
      var wholeSum = addStrings(
        padLeft(left.whole, wholeNorm), 
        padLeft(right.whole, wholeNorm),
        fractionalCarry
      );
      
      var result = new Big(
        wholeSum + "." + fractionalSum
      );
      
      if (negate) {
        result.sign = NEGATIVE;
      }
      
      return result;
    } 
  }
  
  // Add two strings together.
  // Call with two strings of equal length which only
  // contain digits. Optionally include the carry
  // argument. The result argument is used only in 
  // recursion.
  function addStrings(left, right, carry, result) {
  
    // Default argument values.

    if (carry == null) {
      carry = 0;
    }
    
    if (result == null) {
      result = "";
    }
  
    if (left.length != right.length) {
      throw "Bad addStrings arguments";
    }
    
    // Find the sum of adding the last two digits in the strings.
    var sum = carry + parseInt(left[left.length - 1]) + parseInt(right[right.length - 1]);
    
    // Extract the carry (if any).
    if (sum >= 10) {
      carry = Math.floor(sum / 10);
    }
    else {
      carry = 0;
    }
    
    // Find the sum without the carry (single digit).
    result = (sum - (carry * 10)) + result;
    
    // Recursive base case: the last digit has been parsed.
    if (left.length == 1) {
      return (carry == 0 ? "" : carry) + result;
    }
    
    // Otherwise recurse with the same strings minus their final characters.
    else {
      return addStrings(
        left.substring(0, left.length - 1),
        right.substring(0, right.length - 1),
        carry,
        result
      );
    }
  }
  
  // Subtract one Big object from another.
  function subtract(left, right) {
  
    // Trivial case.
    if (left.equals(right)) {
      return new Big("0.0");
    }

    // If the signs are unequal.
    else if (left.sign != right.sign) {
      if (left.sign == NEGATIVE) {
        return add(left.negate(), right).negate();
      }
      else {
        return add(left, right.negate());
      }
    }
    
    // The signs are the same.
    else {
    
      // One negative number minus another. Restate the problem.
      if (left.sign == NEGATIVE) {
        return subtract(right.negate(), left.negate());
      }
      
      // If the left argument is less than the right, then
      // reframe the problem and negate. This way, for the
      // rest of the algorithm left is guaranteed to be 
      // greater than right.
      if (left.lessThan(right)) {
        return subtract(right, left).negate();
      }
      
      // Prepare and pad variables.
      var 
        lw = left.whole,
        rw = right.whole,
        lf = left.fractional,
        rf = right.fractional;
      
      var wholeNorm = Math.max(
        lw.length,
        rw.length
      );
      
      lw = padLeft(lw, wholeNorm);
      rw = padLeft(rw, wholeNorm);
      
      var fractionalNorm = Math.max(
        lf.length,
        rf.length
      );
      
      lf = padRight(lf, fractionalNorm);
      rf = padRight(rf, fractionalNorm);
      
      // Inspect the fractional components.
      var fracCmp = strcmp(lf, rf);
      
      var fractional;
      
      switch (fracCmp) {

        // If the fractionals are equal, then the resulting
        // fractional component will be zero.
        case 0:
          fractional = "0";
          break;
          
        // If the fractional component on the left is less than
        // the one on the right, then it will be necessary to
        // borrow from the whole component of the left in order
        // to complete the subtraction.
        case -1:
          lw = borrowFromString(lw);
          
          fractional = subtractStrings("1" + lf, "0" + rf).substring(1);
          break;
        
        // Otherwise, no borrowing necessary. Just do a simple 
        // subtraction on the fractional components.
        case 1:
          fractional = subtractStrings(lf, rf);
          break;
      }
      
      // Since left is guaranteed to be greater then right, 
      // no borrowing can occurr from this point. Do a simple
      // subtraction on the whole components.
      var whole = subtractStrings(lw, rw);
      
      var result = new Big(whole + "." + fractional);
      
      return result;
    }
  }
  
  // Subtract one string from another.
  // Both strings must be of the same length and have
  // only digits. Also the left argument must be 
  // greater than right (i.e. borrowing may need to be 
  // done before calling this function). The result 
  // argument is used only in recursion.
  function subtractStrings(left, right, result) {

    if (left.length != right.length) {
      throw "Bad subtractStrings args";
    }
    
    // Default argument for result.
    if (!result) {
      result = "";
    }
    
    // Base case: empty string, the result is the answer.
    if (!left.length) {
      return result;
    }
    
    // Prepare variables.
    var 
      len = left.length - 1,
      
      lrem = left.substring(0, len),
      rrem = right.substring(0, len),
      
      ldig = parseInt(left[len], 10),
      rdig = parseInt(right[len], 10);
    
    // If the left digit is less than the right digit
    // borrow from the rest of the left string.
    if (ldig < rdig) {
      lrem = borrowFromString(lrem);
      ldig += 10;
    }
    
    // Now ldig is safely larger than rdig, do the 
    // digital subtraction.
    diff = (ldig - rdig).toString();
    
    // Prepend the difference to the result.
    result = diff + result;
    
    // Recurse with the remainders.
    return subtractStrings(lrem, rrem, result);
  }
  
  // Subtract one from the string as a simple borrow and return
  // the result. The string must be greater than or equal to one.
  function borrowFromString(str) {
    // If the final digit cannot be borrowed from, borrow "ten" from
    // the rest of the string.
    if (str[str.length - 1] == "0") {
      return borrowFromString(str.substring(0, str.length - 1)) + "9";
    }
    
    // Otherwise return the string with one less in the final digit.
    else {
      return str.substring(0, str.length - 1) + (parseInt(str[str.length - 1], 10) - 1);
    }
  }
  
  // Internal Utils:
  ///////////////////////////////////////////////////////
  
  function padLeft(n, d) {
    return Array(Math.max(0, d - (n + '').length + 1)).join(0) + n;
  };
  
  function padRight(n, d) {
    return n + Array(Math.max(0, d - (n + '').length + 1)).join(0);
  };
  
  function trim(n) {
    return n.replace(/(^(0|\s)*)|((0|\s)*$)/g, "");
  }
  
  function triml(n) {
    return n.replace(/(^(0|\s)*)/, "");
  }
  
  function trimr(n) {
    return n.replace(/((0|\s)*$)/, "");
  }
  
  function strcmp(left, right) {
    if (left.length != right.length) {
      throw "Bad strcmp args";
    }
    else if (left.length == 0) {
      return 0;
    }
    else if (left[0] < right[0]) {
      return -1;
    }
    else if (left[0] > right[0]) {
      return 1;
    }
    else {
      return strcmp(
        left.substring(1),
        right.substring(1)
      );
    }
  }  
  
})();
