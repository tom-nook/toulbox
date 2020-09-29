---
title: How to Use Dependency Injection
description: Dependency injection is the idea of removing dependencies from within a function and aids in building a more resilient codebase by doing so. 
date: 2020-09-19
tags:
 - TDD 
 - software-engineering
layout: layouts/post.njk
---

# Intro 

<!-- Excerpt Start -->
Dependency injection is the idea of removing dependencies from within a function and aids in building a more resilient codebase by doing so. Removing dependencies from a function also makes it easier to debug because tests are more straightforward to conduct. 
To better understand dependency injection, an example will be shown using test-driven development.
<!-- Excerpt End -->

## Example

Suppose we have a file called `user.json` containing a single user's information, and we want to get their age via a function.

### Data structure

```json
// user.json
{
 age: 34
}
```

One might think the first step might be to create a `user.json` file to work with.

### Function

```go
type User struct {
 Age int `json:"age"`
}
// GetUserData opens a file and returns a piece of data
func GetUserData(fPath String) (String, error) {
 userFile, err := os.Open(fPath)
 if err != nil {
 fmt.Println(err)
 }
 byteValue, _ := ioutil.ReadAll(userFile)
 var u User
 json.Unmarshal(byteValue, &u)
 return u
}
```

### Test Function

```go
func TestGetUserData(t *testing.T) {
 t.Parallel()
 got, _ := GetUserData("../test/resources/user.json")
 s := fmt.Sprint(got)
 if s == "" {
 t.Errorf("Wanted %s got %s", got, s)
 }
}
```

### Dependencies

The above function works, and the test also works. However, the following dependencies have been introduced:

- File path
- Existence of user.json file in the codebase

At first glance, it seems like no big deal. However, this small decision adds up over time as the codebase grows. 

If the pattern of supplying sample files for testing is established early on, it is likely to continue.

And if it continues, then there may end up being tens, if not at worst, hundred of fake test files. 

That means unnecessary bloat and also additional work on maintenance of the fake test files.


### Solution - Split the function into two

Remove the dependencies from the function. It should not be responsible for opening a file. Instead, the opening and returning of the file's data will be a function `GetFileData` , which will then be passed to the new function `GetUserAge`.

#### 1. GetFileData

```go

import (
 "bytes"
 "encoding/json"
 "fmt"
 "io"
 "io/ioutil"
 "log"
 "testing"
)

type User struct {
 Age int `json:"age"`
}

func GetFileData(rdr io.Reader) ([]byte, error) {
 contents, err := ioutil.ReadAll(rdr)
 if err != nil {
 log.Fatalf("Error reading data %v", err)
 }
 return contents, nil
}

func TestGetFileData(t *testing.T) {
 t.Parallel()
 got, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
 s := fmt.Sprint(got)
 if s == "" {
 t.Errorf("Wanted %s got %s", got, s)
 }
}
```
#### 2. GetUserAge


```go
package main

import (
 "bytes"
 "encoding/json"
 "fmt"
 "io"
 "io/ioutil"
 "log"
 "testing"
)

type User struct {
 Age int `json:"age"`
}

func GetUserAge(data []byte) int {
 u := &User{}
 err := json.Unmarshal(data, u)
 if err != nil {
 log.Fatalf("JSON unmarshal error %v", err)
 }
 return u.Age
}

func TestGetAge(t *testing.T) {
 t.Parallel()
 data, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
 got := GetUserAge(data)
 want := 34
 if got != want {
 t.Errorf("Got %d want %d", got, want)
 }
}

```

### Final Solution

In the GetUserAge function, there's a declaration of the `User` structure, which is not what the service is responsible for. So instead, it can be refactored to be removed from the function.

As shown in the final result below. Again the idea is only to have code related to precisely what the function is supposed to do; anything else can be removed and passed in as an argument.. 

[See it Live on go playground](https://play.golang.org/p/bV8bNxqm06W)

```go
package main

import (
 "bytes"
 "encoding/json"
 "fmt"
 "io"
 "io/ioutil"
 "log"
 "testing"
)

type User struct {
 Age int `json:"age"`
}

// Declare an empty User struct for testing
var u = &User{}

func TestGetAge(t *testing.T) {
 t.Parallel()
 data, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
 got := GetUserAge(data,u)
 want := 34
 if got != want {
 t.Errorf("Got %d want %d", got, want)
 }
}

func TestGetFileData(t *testing.T) {
 t.Parallel()
 got, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
 s := fmt.Sprint(got)
 if s == "" {
 t.Errorf("Wanted %s got %s", got, s)
 }
}

// Pass in a pointer to the user
func GetUserAge(data []byte, u *User) int {
 err := json.Unmarshal(data, u)
 if err != nil {
 log.Fatalf("JSON unmarshal error %v", err)
 }
 return u.Age

}

func GetFileData(rdr io.Reader) ([]byte, error) {
 contents, err := ioutil.ReadAll(rdr)
 if err != nil {
 log.Fatalf("Error reading data %v", err)
 }
 return contents, nil
}
```

### Conclusion

**Big Idea -** The function is split into two, each with their own single responsibility. Allowing them to receive the data in its true form and not be responsible for dealing with file paths and files.

