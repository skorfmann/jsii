package software.amazon.jsii.tests.calculator.PythonSelf;

/**
 * EXPERIMENTAL
 */
@javax.annotation.Generated(value = "jsii-pacmak")
@software.amazon.jsii.Stability(software.amazon.jsii.Stability.Level.Experimental)
@software.amazon.jsii.Jsii(module = software.amazon.jsii.tests.calculator.$Module.class, fqn = "jsii-calc.PythonSelf.ClassWithSelfKwarg")
public class ClassWithSelfKwarg extends software.amazon.jsii.JsiiObject {

    protected ClassWithSelfKwarg(final software.amazon.jsii.JsiiObjectRef objRef) {
        super(objRef);
    }

    protected ClassWithSelfKwarg(final software.amazon.jsii.JsiiObject.InitializationMode initializationMode) {
        super(initializationMode);
    }

    /**
     * EXPERIMENTAL
     * <p>
     * @param props This parameter is required.
     */
    @software.amazon.jsii.Stability(software.amazon.jsii.Stability.Level.Experimental)
    public ClassWithSelfKwarg(final @org.jetbrains.annotations.NotNull software.amazon.jsii.tests.calculator.PythonSelf.StructWithSelf props) {
        super(software.amazon.jsii.JsiiObject.InitializationMode.JSII);
        software.amazon.jsii.JsiiEngine.getInstance().createNewObject(this, new Object[] { java.util.Objects.requireNonNull(props, "props is required") });
    }

    /**
     * EXPERIMENTAL
     */
    @software.amazon.jsii.Stability(software.amazon.jsii.Stability.Level.Experimental)
    public @org.jetbrains.annotations.NotNull software.amazon.jsii.tests.calculator.PythonSelf.StructWithSelf getProps() {
        return this.jsiiGet("props", software.amazon.jsii.tests.calculator.PythonSelf.StructWithSelf.class);
    }

    /**
     * A fluent builder for {@link software.amazon.jsii.tests.calculator.PythonSelf.ClassWithSelfKwarg}.
     */
    @software.amazon.jsii.Stability(software.amazon.jsii.Stability.Level.Experimental)
    public static final class Builder {
        /**
         * EXPERIMENTAL
         * <p>
         * @return a new instance of {@link Builder}.
         */
        @software.amazon.jsii.Stability(software.amazon.jsii.Stability.Level.Experimental)
        public static Builder create() {
            return new Builder();
        }

        private final software.amazon.jsii.tests.calculator.PythonSelf.StructWithSelf.Builder props;

        private Builder() {
            this.props = new software.amazon.jsii.tests.calculator.PythonSelf.StructWithSelf.Builder();
        }

        /**
         * EXPERIMENTAL
         * <p>
         * @return {@code this}
         * @param self This parameter is required.
         */
        @software.amazon.jsii.Stability(software.amazon.jsii.Stability.Level.Experimental)
        public Builder self(final java.lang.String self) {
            this.props.self(self);
            return this;
        }

        /**
         * @returns a newly built instance of {@link software.amazon.jsii.tests.calculator.PythonSelf.ClassWithSelfKwarg}.
         */
        @software.amazon.jsii.Stability(software.amazon.jsii.Stability.Level.Experimental)
        public software.amazon.jsii.tests.calculator.PythonSelf.ClassWithSelfKwarg build() {
            return new software.amazon.jsii.tests.calculator.PythonSelf.ClassWithSelfKwarg(
                this.props.build()
            );
        }
    }
}
