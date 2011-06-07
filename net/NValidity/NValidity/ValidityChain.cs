using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace NValidity
{
    public class ValidityChain
    {
        protected List<string> reduction;
        protected Validity parent;

        public ValidityChain(Validity _parent, params string[] _strings)
        {
            reduction = new List<string>(_strings);
            parent = _parent;
        }

        public ValidityChain Require()
        {
            return Validate(s => s.Length > 0);
        }

        public ValidityChain Match(Regex pattern)
        {
            return Validate(s => pattern.IsMatch(s));
        }

        public ValidityChain Match(NamedPatterns name) {
            Regex pattern = null;

            switch (name) {
                case NamedPatterns.Date:
                    pattern = new Regex(@"^([01]?\d)\/([012]?\d|30|31)\/\d{1,4}$");
                    break;
                case NamedPatterns.Email:
                    pattern = new Regex(@"^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$", RegexOptions.IgnoreCase);
                    break;
                case NamedPatterns.Guid:
                    pattern = new Regex(@"^(\{?([0-9a-fA-F]){8}-(([0-9a-fA-F]){4}-){3}([0-9a-fA-F]){12}\}?)$");
                    break;
                case NamedPatterns.Integer:
                    pattern = new Regex(@"^\d+$");
                    break;
                case NamedPatterns.Number:
                    pattern = new Regex(@"^[+-]?(\d+(\.\d*)?|\.\d+)([Ee]\d+)?$");
                    break;
                case NamedPatterns.Phone:
                    pattern = new Regex(@"^[2-9]\d{2}-\d{3}-\d{4}$");
                    break;
                case NamedPatterns.Time12:
                    pattern = new Regex(@"^[01]?\d:[0-5]\d?\s?[aApP]\.?[mM]\.?$");
                    break;
                case NamedPatterns.Time24:
                    pattern = new Regex(@"^(20|21|22|23|[01]\d|\d)(([:][0-5]\d){1,2})$");
                    break;
                case NamedPatterns.URL:
                    pattern = new Regex(@"^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$", RegexOptions.IgnoreCase);
                    break;
                case NamedPatterns.USD:
                    pattern = new Regex(@"^\$?(\d{1,3},?(\d{3},?)*\d{3}(\.\d{0,2})?|\d{1,3}(\.\d{0,2})?|\.\d{1,2}?)$");
                    break;
                case NamedPatterns.Zip:
                    pattern = new Regex(@"^\d{5}(-\d{4})?$");
                    break;
            }

            return Validate(s => pattern.IsMatch(s));
        }

        public ValidityChain Range(Decimal min, Decimal max) {
            return Validate(s => {
                Decimal d;

                if (decimal.TryParse(s, out d)) {
                    return d <= max && d >= min;
                }
                
                else {
                    return false;
                }
            });
        }

        public ValidityChain Range(DateTime min, DateTime max) {
            return Validate(s => {
                DateTime d;

                if (DateTime.TryParse(s, out d)) {
                    return d <= max && d >= min;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain GreaterThan(Decimal min) {
            return Validate(s => {
                Decimal d;

                if (Decimal.TryParse(s, out d)) {
                    return d > min;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain GreaterThan(DateTime min) {
            return Validate(s => {
                DateTime d;

                if (DateTime.TryParse(s, out d)) {
                    return d > min;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain GreaterThanOrEqualTo(Decimal min) {
            return Validate(s => {
                Decimal d;

                if (Decimal.TryParse(s, out d)) {
                    return d >= min;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain GreaterThanOrEqualTo(DateTime min) {
            return Validate(s => {
                DateTime d;

                if (DateTime.TryParse(s, out d)) {
                    return d >= min;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain LessThan(Decimal max) {
            return Validate(s => {
                Decimal d;

                if (Decimal.TryParse(s, out d)) {
                    return d < max;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain LessThan(DateTime max) {
            return Validate(s => {
                DateTime d;

                if (DateTime.TryParse(s, out d)) {
                    return d < max;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain LessThanOrEqualTo(Decimal max) {
            return Validate(s => {
                Decimal d;

                if (Decimal.TryParse(s, out d)) {
                    return d <= max;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain LessThanOrEqualTo(DateTime max) {
            return Validate(s => {
                DateTime d;

                if (DateTime.TryParse(s, out d)) {
                    return d <= max;
                }

                else {
                    return false;
                }
            });
        }

        public ValidityChain MaxLength(int max) {
            return Validate(s => s.Length <= max);
        }

        public ValidityChain MinLength(int min) {
            return Validate(s => s.Length >= min);
        }

        public ValidityChain NonHtml() {
            return Match(new Regex(@"^[^<>]*$"));
        }

        public ValidityChain Equal() {
            if (reduction.Any()) {
                var temp = reduction.First();
                var a = reduction.ToArray();

                for (var idx = 1; idx < reduction.Count; ++idx) {
                    if (a[idx] != temp) {
                        Invalidate();
                        return this;
                    }
                }
            }
                
            return this;
        }

        public ValidityChain Equal(Func<string, string> transform) {
            if (reduction.Any()) {
                var temp = transform(reduction.First());
                var a = reduction.ToArray();

                for (var idx = 1; idx < reduction.Count; ++idx) {
                    if (transform(a[idx]) != temp) {
                        Invalidate();
                        return this;
                    }
                }
            }

            return this;
        }

        public ValidityChain Distinct() {
            var values = new List<string>();
            var a = reduction.ToArray();

            foreach (var s in a) {
                if (values.Contains(s)) {
                    Invalidate();
                    return this;
                }

                values.Add(s);
            }

            return this;
        }

        public ValidityChain Distinct(Func<string, string> transform) {
            var values = new List<string>();
            var a = reduction.ToArray();

            foreach (var s in a) {
                if (values.Contains(transform(s))) {
                    Invalidate();
                    return this;
                }

                values.Add(transform(s));
            }

            return this;
        }

        public ValidityChain Sum(decimal sum) {
            if (this.sum() != sum) {
                Invalidate();
            }

            return this;
        }

        public ValidityChain SumMax(decimal max) {
            if (this.sum() > max) {
                Invalidate();
            }

            return this;
        }

        public ValidityChain SumMin(decimal min) {
            if (this.sum() > min) {
                Invalidate();
            }

            return this;
        }

        protected ValidityChain Validate(Func<string, bool> regimen)
        {
            var a = reduction.ToArray();
            
            foreach (var s in a)
            {
                if (!regimen(s))
                {
                    this.Invalidate(s);
                }
            }

            return this;
        }

        protected void Invalidate() {
            reduction.RemoveAll(x => true);
            parent.Errors++;
        }

        protected void Invalidate(string s)
        {
            reduction.Remove(s);
            parent.Errors++;
        }

        protected decimal sum() {
            var acc = 0m;
            decimal temp;

            foreach (var s in reduction) {
                if (decimal.TryParse(s, out temp)) {
                    acc += temp;
                }
            }

            return acc;
        }
    }
}
