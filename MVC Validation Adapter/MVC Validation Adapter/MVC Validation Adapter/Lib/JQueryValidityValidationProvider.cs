using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace JQueryValidity {
    public class ValidationProvider : ModelValidatorProvider {
        public override IEnumerable<ModelValidator> GetValidators(ModelMetadata metadata, ControllerContext context) {
            throw new NotImplementedException();
        }
    }
}
