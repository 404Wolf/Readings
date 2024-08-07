---
id: 5a10ad8c-0d99-11ef-9ccf-87911ceebd3f
title: Blair Frandeen
tags:
  - RSS
date_published: 2024-05-08 16:30:43
---

# Blair Frandeen
#Omnivore

[Read on Omnivore](https://omnivore.app/me/blair-frandeen-18f5ab53277)
[Read Original](https://blairfrandeen.com/blog/exploring_code_coverage)



[ ![Made with LibreOffice](https:&#x2F;&#x2F;proxy-prod.omnivore-image-cache.app&#x2F;0x75,skIyb9MgjcC49kQpdGGrdbgCosLnNgmsA3Ip6YBV45kc&#x2F;https:&#x2F;&#x2F;blairfrandeen.com&#x2F;static&#x2F;bflogo.png) ](https:&#x2F;&#x2F;blairfrandeen.com&#x2F;index.html)

How do coverage tools inspect our Python code and report back on which lines were run? I got curious, so I wrote a couple of bare-bones coverage demos using the Python standard library, and compared these to the inner workings of [Coverage.py](https:&#x2F;&#x2F;github.com&#x2F;nedbat&#x2F;coveragepy&#x2F;), a popular library for measuring code coverage in Python.

## A simple coverage example

To start, I’ll write simple function and a single call to that function that only covers one of the branches:

&#x60;&#x60;&#x60;python
# is_even.py

def is_even(num: int) -&gt; bool:
    if num % 2 &#x3D;&#x3D; 0:
        return True
    return False

is_even(3)
&#x60;&#x60;&#x60;

To run this and show that we don’t have full coverage, make sure that &#x60;coverage&#x60; is installed:

&#x60;&#x60;&#x60;cmake
pip install coverage
&#x60;&#x60;&#x60;

Then run the script with coverage, and generate a report:

&#x60;&#x60;&#x60;angelscript
$ coverage run is_even.py 
$ coverage report
Name         Stmts   Miss  Cover
--------------------------------
is_even.py       5      1    80%
--------------------------------
TOTAL            5      1    80%
&#x60;&#x60;&#x60;

This is great, and what we expect: the &#x60;is_even.py&#x60; script has 5 statements, including the function call, and one of them, &#x60;return True&#x60;, never got executed, so we have 80% test coverage.

We’ll use this example script to demonstrate some of the ways that Python can introspect its code and produce a coverage report.

## Measuring coverage with &#x60;trace.Trace&#x60;

My goal now is to recreate the above result from scratch. A quick trip to the Python documentation points me to [the trace module](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;trace.html#programmatic-interface). The script below is an example based on the official documentation:

&#x60;&#x60;&#x60;routeros
#!&#x2F;usr&#x2F;bin&#x2F;python3
# trace_cov.py

import trace

from is_even import is_even

tracer &#x3D; trace.Trace(
    trace&#x3D;False,  # if True, display a line-by-line trace as the execution happens
    count&#x3D;True,  # if True, show a count of how many times each line was executed
)

tracer.run(&quot;is_even(3)&quot;)
res &#x3D; tracer.results()
res.write_results(show_missing&#x3D;True)

with open(&quot;is_even.cover&quot;, &quot;r&quot;) as report:
    for line in report:
        print(line, end&#x3D;&quot;&quot;)
&#x60;&#x60;&#x60;

When I run this, I get a less polished but still intelligible result:

&#x60;&#x60;&#x60;ruby
$ .&#x2F;trace_cov.py
&gt;&gt;&gt;&gt;&gt;&gt; def is_even(num: int) -&gt; bool:
    1:     if num % 2 &#x3D;&#x3D; 0:
&gt;&gt;&gt;&gt;&gt;&gt;         return True
    1:     return False
       
&gt;&gt;&gt;&gt;&gt;&gt; is_even(3)
&#x60;&#x60;&#x60;

The &#x60;&gt;&gt;&gt;&gt;&gt;&gt;&#x60;s point to lines that aren’t being run, and the &#x60;1:&#x60; indicates the count of how many times the lines were run. The &#x60;trace.Trace.run()&#x60; command doesn’t seem to include the function definition as having been run, but otherwise our result is the same as &#x60;pytest-cov&#x60;: we missed the one &#x60;return True&#x60; statement.

As an experiment, we can modify the script above by replacing one line,

&#x60;&#x60;&#x60;dockerfile
tracer.run(&quot;is_even(3);is_even(2)&quot;)
&#x60;&#x60;&#x60;

And seeing now that the &#x60;if&#x60; statement gets run twice, and each branch gets run once:

&#x60;&#x60;&#x60;angelscript
$ .&#x2F;trace_cov.py
&gt;&gt;&gt;&gt;&gt;&gt; def is_even(num: int) -&gt; bool:
    2:     if num % 2 &#x3D;&#x3D; 0:
    1:         return True
    1:     return False
       
&gt;&gt;&gt;&gt;&gt;&gt; is_even(3)
&#x60;&#x60;&#x60;

From here we could easily write a line counter and a function to report on which lines weren’t run. But I’m interested in the internals of how this works, so let’s dig deeper and see what’s happening in &#x60;trace.Trace&#x60;.

## Measuring Coverage with &#x60;sys.settrace&#x60;

The &#x60;trace&#x60; module uses the [sys.settrace](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sys.html#sys.settrace) function and then &#x60;exec&#x60;s the code that was passed to &#x60;Trace.run&#x60;. The source code where this happens is [here](https:&#x2F;&#x2F;github.com&#x2F;python&#x2F;cpython&#x2F;blob&#x2F;817190c303e0650d7da5e52e82feb6505fc6b761&#x2F;Lib&#x2F;trace.py#L448-L450). [sys.settrace](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sys.html#sys.settrace) allows us to specify a custom function that will be called every time a frame is executed. We’ll talk about execution frames later, but first let’s look at a custom trace function to see how it works.

From following the documentation and [some key parts of trace.py](https:&#x2F;&#x2F;github.com&#x2F;python&#x2F;cpython&#x2F;blob&#x2F;817190c303e0650d7da5e52e82feb6505fc6b761&#x2F;Lib&#x2F;trace.py#L566-L577), I was able to come up with the following script, that simply prints the line numbers that are being executed, along with their source code:

&#x60;&#x60;&#x60;python
#!&#x2F;usr&#x2F;bin&#x2F;python3
# trace_frame.py

import linecache
import sys

from is_even import is_even

def line_tracer(frame, event, _):
    if event &#x3D;&#x3D; &quot;line&quot; or event &#x3D;&#x3D; &quot;call&quot;:
        filename &#x3D; frame.f_code.co_filename
        lineno &#x3D; frame.f_lineno
        line_source &#x3D; linecache.getline(filename, lineno)
        if line_source:
            print(f&quot;{event.upper()}-{str(lineno)+&#39;:&#39;:&lt;4}{line_source}&quot;, end&#x3D;&quot;&quot;)
        return line_tracer


sys.settrace(line_tracer)

is_even(3)
&#x60;&#x60;&#x60;

When we run this script we get the following output:

&#x60;&#x60;&#x60;angelscript
$ .&#x2F;trace_frame.py
CALL-1:  def is_even(num: int) -&gt; bool:
LINE-2:      if num % 2 &#x3D;&#x3D; 0:
LINE-4:      return False
&#x60;&#x60;&#x60;

The output of the script is the type of event, a function &#x60;CALL&#x60; or a &#x60;LINE&#x60; execution, followed by the line number and the code on that line.

The call to &#x60;sys.settrace(line_tracer)&#x60; sets the system’s trace function, and &#x60;line_tracer&#x60; is called every time a frame is executed. For tracking code coverage, we are only interested in &#x60;&quot;line&quot;&#x60; and &#x60;&quot;call&quot;&#x60; events. When we &#x60;&quot;call&quot;&#x60; a function, the Python interpreter enters a new scope. When a new scope is entered, it’s possible to use a different tracing function for the new scope than we had for the previous scope. To enable this, our &#x60;line_tracer&#x60; function returns the trace function that should be used for the next frame.

To demonstrate that the trace function must return itself or another trace function, we comment out the last line of &#x60;line_tracer&#x60;. Removing the &#x60;return&#x60; statement is equivalent to calling &#x60;sys.settrace(None)&#x60; after the function call; the line executions in the function body aren’t registered:

&#x60;&#x60;&#x60;sql
$ .&#x2F;trace_frame.py
CALL-1:  def is_even(num: int) -&gt; bool:
&#x60;&#x60;&#x60;

You can see an example of the global trace function returning the local trace function in the [trace standard library source code](https:&#x2F;&#x2F;github.com&#x2F;python&#x2F;cpython&#x2F;blob&#x2F;817190c303e0650d7da5e52e82feb6505fc6b761&#x2F;Lib&#x2F;trace.py#L528-L549).

### Diving deeper into Python execution frames and code objects

These tracer functions take a [frame](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;reference&#x2F;datamodel.html#frame-objects) object as their first argument. A frame contains a [code object (frame.f\_code)](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;reference&#x2F;datamodel.html#code-objects), which represents the [bytecode](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;glossary.html#term-bytecode), or the “internal representation of a Python program in the CPython interpreter.” Frame objects also contain a pointer to the previous frame in the stack, if one exists, and the local and global dictionaries that are in scope for that frame.

I found it instructive to add the following line to the &#x60;line_tracer&#x60; function:

&#x60;&#x60;&#x60;css
        print(frame.f_code.co_code)
&#x60;&#x60;&#x60;

This prints out the bytecode that is being executed in each frame. Re-running our script with the additional &#x60;print&#x60; statement gives us this mess:

&#x60;&#x60;&#x60;llvm
 .&#x2F;trace_frame.py
b&#39;|\x00d\x01\x16\x00d\x02k\x02r\x08d\x03S\x00d\x04S\x00&#39;
CALL-1:  def is_even(num: int) -&gt; bool:
b&#39;|\x00d\x01\x16\x00d\x02k\x02r\x08d\x03S\x00d\x04S\x00&#39;
LINE-2:      if num % 2 &#x3D;&#x3D; 0:
b&#39;|\x00d\x01\x16\x00d\x02k\x02r\x08d\x03S\x00d\x04S\x00&#39;
LINE-4:      return False
&#x60;&#x60;&#x60;

That string of bytes is the op-codes that the Python interpreter is executing. We can start to understand them by using the &#x60;dis&#x60; module:

&#x60;&#x60;&#x60;angelscript
&gt;&gt;&gt; import dis
&gt;&gt;&gt; dis.dis(b&#39;|\x00d\x01\x16\x00d\x02k\x02r\x08d\x03S\x00d\x04S\x00&#39;)
          0 LOAD_FAST                0
          2 LOAD_CONST               1
          4 BINARY_SUBSCR_TUPLE_INT
          8 COMPARE_OP               2 (&lt;)
         12 LOAD_CONST               3
         14 RETURN_VALUE
         16 LOAD_CONST               4
         18 RETURN_VALUE
&#x60;&#x60;&#x60;

The above output is the bytecode in human-readable format. To help understand what data this bytecode is operating on, let’s add the following block of code to the start of the &#x60;line_tracer&#x60; function:

&#x60;&#x60;&#x60;python
    if event &#x3D;&#x3D; &quot;call&quot;:
        # tuple of all of the constants in the execution frame:
        print(f&quot;{frame.f_code.co_consts&#x3D;}&quot;)
        # tuple of all of the variables in the execution frame:
        print(f&quot;{frame.f_code.co_varnames&#x3D;}&quot;)
        # dictionary of local variables in the exection frame and their values:
        print(f&quot;{frame.f_locals&#x3D;}&quot;)
&#x60;&#x60;&#x60;

Now when we run the script, we see the data the code object contains. When the &#x60;LOAD_FAST 0&#x60; code is executed, it loads the 0th element of &#x60;frame.f_code.co_varnames&#x60; onto the stack, which is the &#x60;num&#x60; argument we passed in. When &#x60;LOAD_CONST&#x60; is called, it loads the corresponding value from &#x60;frame.f_code.co_consts&#x60; onto the stack.

Importantly, &#x60;frame.f_locals&#x60; is associated with the execution frame, but not with the code object being executed. This means that the same code object can be executed by different frames having different local variables.

From the previous section, we learned that we can use &#x60;sys.settrace&#x60; to specify which function is called every time a frame is executed. This short trip into the CPython bytecode interpreter helped me to get a stronger working definition of an execution frame.

For a slightly deeper dive into Python bytecode, I recommend [this article](https:&#x2F;&#x2F;opensource.com&#x2F;article&#x2F;18&#x2F;4&#x2F;introduction-python-bytecode).

## Back to Coverage.py

We’ve now gone a few levels deep in understanding how to trace a Python program’s execution, how to write a custom trace function that acts on execution frames, and what those execution frames look like in practice. So is this how Coverage.py does its job?

Sort of, sometimes. When you think about it, calling a trace function on every line of code gets expensive, especially when it’s a pure Python function. As explained in the [Coverage.py documentation](https:&#x2F;&#x2F;github.com&#x2F;nedbat&#x2F;coveragepy&#x2F;blob&#x2F;master&#x2F;doc&#x2F;howitworks.rst#execution), the trace function is written in C. Ned Batchedler, the Coverage.py maintainer, [wrote an excellent article explaining how it works](https:&#x2F;&#x2F;nedbatchelder.com&#x2F;text&#x2F;trace-function.html).

To prove to myself that tracing takes a long time, I wrote a really bad program, and timed it under a few scenarios:

&#x60;&#x60;&#x60;python
#!&#x2F;usr&#x2F;bin&#x2F;python3
# fib.py
import sys


def fib(n):
    &quot;&quot;&quot;Return the nth Fibonnaci number in exponential time.&quot;&quot;&quot;
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)


print(fib(int(sys.argv[1])))
&#x60;&#x60;&#x60;

I ran the script on its own, with &#x60;coverage run&#x60;, and &#x60;coverage run --timid&#x60;. The &#x60;--timid&#x60; argument forces coverage to use the [PyTracer class](https:&#x2F;&#x2F;github.com&#x2F;nedbat&#x2F;coveragepy&#x2F;blob&#x2F;a11e0e23f57b2332e79d775135d891789bb01543&#x2F;coverage&#x2F;pytracer.py#L37), circumventing the C tracer to pass a Python function to &#x60;sys.settrace&#x60; like our example above.

| Scenario                                               | Command                         | Execution Time (seconds) |
| ------------------------------------------------------ | ------------------------------- | ------------------------ |
| No coverage measurement                                | .&#x2F;fib.py 30                     | 0.245                    |
| Coverage.py measurement with the C trace function      | coverage run fib.py 30          | 0.899                    |
| Coverage.py measurement with the Python trace function | coverage run \--timid fib.py 30 | 8.21                     |

As expected, calling a trace function on _every single frame_ is not free. Using Python trace function rather than a C trace function increased runtime by an order of magnitude for this simple example.

## Wrapping Up

There are other ways to measure code coverage that weren’t explored here. Specifically, the recent [sys.monitoring](https:&#x2F;&#x2F;docs.python.org&#x2F;3&#x2F;library&#x2F;sys.monitoring.html#module-sys.monitoring) addition to Python 3.12 from [PEP 669](https:&#x2F;&#x2F;peps.python.org&#x2F;pep-0669&#x2F;) enables monitoring system events like function calls and line execution without &#x60;sys.settrace&#x60;. However, the [performance is still unlikely to be better than Coverage.py’s C tracer](https:&#x2F;&#x2F;peps.python.org&#x2F;pep-0669&#x2F;#performance):

&gt; Coverage tools can be implemented at very low cost, by returning &#x60;DISABLE&#x60; in all callbacks.
&gt; 
&gt; For heavily instrumented code, e.g. using &#x60;LINE&#x60;, performance should be better than &#x60;sys.settrace&#x60;, but not by that much as performance will be dominated by the time spent in callbacks.

When asking a question like, “how does code coverage work,” it’s difficult to predict even the shape of the answer without some prior knowledge. I started this exploration with a curiosity, and learned that Python has several ways to perform self-introspection on the code it is running. Along the way, I took a dive into the CPython bytecode, and gained a stronger overall understanding of the interpreter.

---

[HOME](https:&#x2F;&#x2F;blairfrandeen.com&#x2F;index.html) | [ABOUT](https:&#x2F;&#x2F;blairfrandeen.com&#x2F;about)

[ ](mailto:thoughts@datum-b.com)

© 2022 - 2024 Blair Frandeen. The views expressed here are solely my own and do not reflect those of my employer.