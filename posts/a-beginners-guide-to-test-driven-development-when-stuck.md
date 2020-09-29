---
title: A Beginner's Guide to Test-Driven Development when Stuck
date: 2020-03-15
description: There you are staring at a blank file. Stuck at where to start. Facing analysis paralysis. Test-Driven Development can help.
image: https://unsplash.com/photos/4JxV3Gs42Ks
tags:
 - TDD
layout: layouts/post.njk
---

<!-- Excerpt Start -->
There you are staring at a blank file. Stuck at where to start for your work or project. You've designed the program flow and understand the logic, but don't know where to start. You're facing analysis paralysis, and Test-Driven Development can help.
<!-- Excerpt End -->

## TDD the Cycle of <span style="color:red">Red</span>, <span style="color:green">Green </span>, <span style="color:blue">Blue</span> 

The big idea of TDD is the Red, Green, Blue development cycle. There are two main concepts. First, inverting the way software is developed, tests are first, not last. The second is to write tests to test the *intended* behavior of the program. For this blog post, we'll focus on the first as a means to get started when you're stuck with a blank file.

To better understand TDD, let's take a trivial case that exercises the development loop of a new feature called *hello visitor*, a function that prints "Hello `{visitor}.`" when invoked, where `{visitor}` is the name of the person using the process, e.g., "Hello Toul," if I used it. Let's start with the Red piece of the loop, a test that fails.


## <span style="color:red">Red</span>

The red part of the cycle is to start with anything, anything at all, even if that means creating a test that will fail. Start with that; anything is better than staring at a blank file for tens of minutes.

### Fail Time 

```go
package main
// main_test.go
import (
 "testing"
 "fmt"
 "HelloVisitor"
)

func TestHelloVisitor(t *testing.T) {
 have := HelloVisitor()
 want := "Hello Toul"
 if have != want {
 fmt.Sprintf("have = %s, want = %s", have, want)
 } 
}
```
##### Run the test

```go
> go test main_test.go -v 

> ./main_test.go:9:10: undefined: HelloVisitor
FAIL command-line-arguments [build failed]
FAIL
```
## <span style="color:green">Green </span>

Whoot, we've got something typed out, now let's get it to pass by doing what the **compiler** wants us to do. The compiler complains about *"undefined: HelloVisitor"*; therefore, our job is to define **HelloVisitor()**. So, we create a *main.go* file with the following code:

```go
package main 
// main.go
func main() {
 HelloVisitor()
}
func HelloVisitor() string {
 return "Hello Toul."
}
```

##### Run the test

```go
> go test main_test.go -v 
=== RUN TestHelloVisitor
--- PASS: TestHelloVisitor (0.00s)
PASS
ok _/go/src/debug 1.794s
```
It passed! Anything goes to get to the green even if that means doing things that would make Donald Knuth cringe like hardcoding a string as a return value for a function.

### <span style="color:blue">Blue</span>

Okay, time to redeem ourselves and make our teachers proud by refactoring in the blue part of the cycle. In this case, the refactoring is straightforward; hardcoded values are a no-no in the software community, so get rid of it by passing it in as an argument.

As refactoring is taking place, it is essential to think about the function's purpose. In this case, the intention is to greet any name, not just mine. 

It is important to note that if the purpose is not clear, then the time should be taken to clarify the function or program's behavior. That means asking the product owners, managers, and teammates for their input. 

Because getting the code to greet persons with names other than Toul can be solved in several different ways, and some are easier than others. When in doubt, go with the simplest solution and submit it for feedback. If others want more, then they can tell you then.

For example, prompting the program used to put in their name and then printing out the name could satisfy the request. Another example is implementing `user accounts` for a web application with the name stored as a browser cookie for subsequent visits to the site is considerably more work. Lastly, another solution could be to create a command-line interface (CLI) that takes in `-name {name}` as an argument. As you can see, there are generally several different ways to solve problems. It is best to start simple and add complexity as needed. 

For this example, we'll start simple and prompt the user to type in their name when running the program as it is the bare minimum needed to eliminate the hardcoded return value of the function.

Again, to change the function, we use the TDD loop.


#### Add the changes

```go
package main 

imports (
 "bufio"
 "fmt"
 "os"
 "strings"
)
func main() {
 // Now, when the program executes 
 // it will expect input from the terminal aka Stdin
 reader := bufio.NewReader(os.Stdin)
 fmt.Print("What is your name: ")
 n, _ := reader.ReadString('\n')
 n = strings.Replace(n, "\n", "", -1)
 res := HelloVisitor(n)
 fmt.Println(res)
}

// HelloVisitor, new version that accepts an argument
func HelloVisitor() {
 // return the string for testing
 return fmt.Sprintf("Hello, %s", n)
}
```

#### <span style="color:red">Red</span>

```go
> go test -v
> main_test.go:9:22: not enough arguments in call to HelloVisitor
 have ()
 want (n)
FAIL [build failed]
Error: Tests failed.
```

#### Update the function

```go 

// Above code remains the same

// HelloVisitor now accepts an argument
func HelloVisitor(n string) string {
 return fmt.Sprintf("Hello, %s", n)
}

```

#### <span style="color:green">Green </span>


```go
package main

import (
 "testing"
 "fmt"
)

func TestHelloVisitor(t *testing.T) {
 have := HelloVisitor("Toul")
 want := "Hello Toul"
 if have != want {
 fmt.Sprintf("have = %s, want = %s", have, want)
 }
}
```

##### Run the test

```
> go test -v 
=== RUN TestHelloVisitor
--- PASS: TestHelloVisitor (0.00s)
PASS
ok code/go/src/debug 0.258s
```

#### <span style="color:blue">Blue</span>

None. At this point, the function has been refactored and passes the test. Until feedback has been given by others or the design has been changed, there's no need for further change.

## Conclusion

As silly as the above example may seem, it has laid down the foundation for systematically creating working code when you don't know where to start. The answer in my opinion is to start with <span style="color:red">Red</span> and get to <span style="color:green">green</span> as soon as possible and then take the time in <span style="color:blue">blue</span> to remove bad practices and to further consider the design of the code.

