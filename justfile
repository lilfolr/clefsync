
# Build the project (default recipe)
default: build

build:
	cargo build

# Run tests
test:
	cargo test

# Clean the build directory
clean:
	cargo clean

# Format the code
fmt:
	cargo fmt

# Check for code linting issues
lint:
	cargo clippy --all-targets -- -D warnings


