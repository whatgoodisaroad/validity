using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NValidity
{
    public class Validity
    {
        public bool Valid {
            get; internal set;
        }

        public int Errors {
            get; internal set;
        }

        public ValidityChain this[params string[] args] {
            get {
                return this.Validate(args);
                
            }
        }

        public ValidityChain Validate(params string[] args) {
            return new ValidityChain(this, args);
        }
    }
}
