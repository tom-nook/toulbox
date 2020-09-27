---
title: Test-Driven Development for Beginners
date: 2020-03-15
description: An introduction to test-driven development for beginners
tags:
 - TDD
layout: layouts/post.njk
---


# Intro
<!-- Excerpt Start -->
There you are staring at a blank file. Stuck at where to start for your work or project. You've designed the program flow and understand the logic that is to be implemented, but don't know where to start. Test-Driven Development can help alleviate analysis paralysis.
<!-- Excerpt End -->

## TDD the Cycle of <span style="color:red">Red</span>, <span style="color:green">Green </span>, <span style="color:blue">Blue</span> 

The big idea of TDD is the  Red, Green, Blue development cycle. It helps to support two concepts. First, it is concerned with inverting the way software is developed; tests are added first not last. Additionally, tests are meant to **intentionally FAIL**. The second is to design tests that test the *intended* behaviour of the API or program being written. For this post we'll keep it simple and focus on the first idea. 


To better understand TDD, let's take a trivial case that exercises the development loop of a new simple feature called *hello visitor*, a function that prints "Hello visitor." when invoked.

## <span style="color:red">Red</span>

The red part of the cycle is to start with anything, anything at all, even if that means creating a test that is going to fail. In fact, start with that, anything is better than staring at a blank file for tens of minutes.

### Fail Time 

```go
package main 
// hello_visitor_test.go
import (
 "testing"
 "fmt"
 "HelloVisitor"
)

func TestHelloVisitor(t *testing.T) {
 have := HelloVisitor()
 want := "Hello nullPtr."
 if have != want {
 fmt.Sprintf("have = %s, want = %s", have, want)
 } 
}
```
##### Run the test

```go
> go test hello_visitor_test.go -v 

> ./hello_visitor_test.go:9:10: undefined: HelloVisitor
FAIL command-line-arguments [build failed]
FAIL
```
### <span style="color:green">Green </span>

Whoot, we've got something typed out, now let's get it to pass, by doing what the **compiler** wants us to do. The compiler complains with *"undefined: HelloVisitor"*, therefore our job is to define **HelloVisitor()**. So, we create a *main.go* file with the following code:

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
> go test hello_visitor_test.go -v 
=== RUN TestHelloVisitor
--- PASS: TestHelloVisitor (0.00s)
PASS
ok _/go/src/debug 1.794s
```
It passed! Anything goes to get to green. Even if that means doing things that would make Donald Knuth cringe like hardcoding a string as a return value for a function.

### <span style="color:blue">Blue</span>

Okay, time to redeem ourselves and to make our teachers proud by refactoring in the blue part of the cycle. In this case the refactoring is straightforward; hardcoded values are a no-no so get rid of it by passing it in as an argument.

Now, as refactoring is taking place it is important to think about the *purpose* of the function. In this case the purpose is to great any name not just mine. 

It is important to note that if the purpose is not clear then the time should be taken to clarify what exactly the function or program is suppose to be responsible for. That means asking the product owners, managers, and teamates for their input. 

Because the end behaviour of a person other names than just Toul can be solved in several different ways and some are easier than others. 

For example prompting the user of the program to put in their name and then printing out the name could satisfy the request. So could a much more complicated solution of implementing `user accounts` for a web application where the name could be remembered as a browser cookie for subsequent visits to the site, which is considerably much more work. 

For this example we'll take the easy route and prompt the user to type in their name when running the program. As it is the bare minimum needed to eliminate the hardcoded return value of the function. Now, we have accomplished the task asked and can *show* it to others for further feedback.


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
    HelloVisitor(n)
}

// HelloVisitor, new version that accepts an argument
func HelloVisitor(n string) {
    return fmt.Sprintf("Hello, %s", n)
}
```

##### Running test

```go
> go test -v
> hello_visitor_test.go:9:22: not enough arguments in call to HelloVisitor
 have ()
 want (n)
FAIL [build failed]
Error: Tests failed.
```

The compiler tells me that I have not updated my test to test the new function. 

I'll do so now.

```go
package main

import (
 "testing"
 "fmt"
)

func TestHelloVisitor(t *testing.T) {
 have := HelloVisitor("Toul")
 want := "Hello Toul."
 if have != want {
 fmt.Sprintf("have = %s, want = %s", have, want)
 }
}
```


##### Running test

```
> go test -v 
=== RUN TestHelloVisitor
--- PASS: TestHelloVisitor (0.00s)
PASS
ok code/go/src/debug 0.258s
```
I still use the Red and Green cycle while refactoring code during the Blue cycle; however, the intent has changed. Instead of only caring about getting the code to green my care has become *how to get the code to green and best answer the request*


### Feedback 

A product owner tells us that while the program works it isn't user friendly, and you suggest that you can either make the program ask for input from the user, build out a cookie solution, or build a simple command line tool. They opt for the command line tool version since 

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("What is your name: ")
	n, _ := reader.ReadString('\n')
    n = strings.Replace(n, "\n", "", -1)
    HelloVisitor(n)
}

func HelloVisitor(n string) {
    fmt.Printf("Hello %s", n)
}

```



## Conclusion

As silly as the above example may seem, it has laid down the foundation for being able to create working code systematically. 

Rather than focusing on trying to create code that handles every possible situation, instead, the *Product Owners* can provide feedback on whether or not the assumption(s) are correct in the code. 

And better yet, I don't have to over-design my code. 

The Product Owners are like the compiler; they tell me how they want the code to behave, and I update my tests or create new ones if they want the code to do more. 