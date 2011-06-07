using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using NValidity;

namespace NValidity.Example {
    class Program {
        static void Main(string[] args) {
            var v = new Validity();

            v["33", "The", "Last", "String", "Should", "Fail", "heh@hotmail.com", string.Empty]
                .Require()
                .Match(NamedPatterns.Integer)
                .Range(20, 40)
                .LessThanOrEqualTo(233)
                .GreaterThan(4)
                .MaxLength(2);

            // v[this.Request.Form["Username"], this.Request.Form["Password"]].Require();

            if (v.Valid) { }

            Console.WriteLine(v.Errors);
            Console.ReadKey();
        }
    }
}
