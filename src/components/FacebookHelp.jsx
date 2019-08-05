// React imports
import React from "react";

const FacebookHelp = () => {
  return (
    <div className="article">
      <section>
        <article>
          <p className="intro-paragraph">
            The <abbr title="Williams Students Online">WSO</abbr> Facebook
            <a href="#fn__1" name="fnt__1" id="fnt__1" className="fn_top">
              <sup>1</sup>
            </a>{" "}
            is an online campus directory. It is accessible on campus without
            login and off campus by logging in with your{" "}
            <abbr title="Office for Information Technology">OIT</abbr> (Unix ID)
            username and password. Please report any strange behavior (after
            looking over the info below) to
            <code>wso-dev</code> <code>[at]</code> <code>wso.williams.edu</code>
            . The more descriptive your bug reports are, the easier the bug is
            to fix. Better yet, come to a meeting (join the{" "}
            <a
              href="http://wso.williams.edu/mailman/listinfo/wso-staff"
              className="urlextern"
              title="http://wso.williams.edu/mailman/listinfo/wso-staff"
              rel="nofollow"
            >
              wso-staff
            </a>{" "}
            list) and help out!
          </p>
          <br />

          <h3>Quick syntax guide for searching</h3>
          <table className="inline">
            <tbody>
              <tr>
                <th> Query </th>
                <th> Meaning </th>
              </tr>
              <tr>
                <td className="code">Ephraim</td>
                <td>
                  {" "}
                  all people whose profiles contain the string
                  &ldquo;ephraim&rdquo; (case-insensitive){" "}
                </td>
              </tr>
              <tr>
                <td className="code">Ephraim Williams</td>
                <td>
                  {" "}
                  (intersection) all people who match <strong>both</strong>{" "}
                  &ldquo;ephraim&rdquo; <strong>and</strong>{" "}
                  &ldquo;williams&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">Ephraim &amp; Williams</td>
                <td>
                  {" "}
                  (intersection) all people who match <strong>both</strong>{" "}
                  &ldquo;ephraim&rdquo; <strong>and</strong>{" "}
                  &ldquo;williams&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">Ephraim, Hopkins</td>
                <td>
                  {" "}
                  (union) all people who match &ldquo;ephraim&rdquo;{" "}
                  <strong>plus</strong> all people who match
                  &ldquo;hopkins&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">Ephraim | Hopkins</td>
                <td>
                  {" "}
                  (union) all people who match &ldquo;ephraim&rdquo;{" "}
                  <strong>plus</strong> all people who match
                  &ldquo;hopkins&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">Ephraim Williams, Mark Hopkins</td>
                <td>
                  {" "}
                  all people who match &ldquo;ephraim&rdquo; <em>and</em>{" "}
                  &ldquo;williams&rdquo; <strong>plus</strong> all people who
                  match &ldquo;mark&rdquo; <em>and</em> &ldquo;hopkins&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">
                  Ephraim, Hopkins &amp; Thompson, Griffin
                </td>
                <td>
                  {" "}
                  all people who match &ldquo;ephraim&rdquo;{" "}
                  <strong>plus</strong> all people who match
                  &ldquo;hopkins&rdquo;
                  <em>and</em> &ldquo;thompson&rdquo;
                  <strong>plus</strong> all people who match
                  &ldquo;griffin&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">
                  (Ephraim, Hopkins) &amp; (Thompson, Griffin)
                </td>
                <td>
                  {" "}
                  all people who match &ldquo;ephraim&rdquo; <em>or</em>{" "}
                  &ldquo;hopkins&rdquo; <strong>and</strong> also match
                  &ldquo;thompson&rdquo; <em>or</em> &ldquo;griffin&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">name: Ephraim</td>
                <td> all people whose names match &ldquo;ephraim&rdquo; </td>
              </tr>
              <tr>
                <td className="code">name: (Ephraim, Hopkins)</td>
                <td>
                  {" "}
                  all people whose names match &ldquo;ephraim&rdquo;{" "}
                  <strong>plus</strong> all people whose names match
                  &ldquo;hopkins&rdquo;{" "}
                </td>
              </tr>
              <tr>
                <td className="code">dorm: &ldquo;Mark Hopkins&rdquo;</td>
                <td>
                  {" "}
                  all people whose dorm matches &ldquo;mark hopkins&rdquo;{" "}
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            Parentheses can be nested to any depth. Labels cannot be nested. It
            doesn&rsquo;t make sense to search only within the dorm field when
            already searching only within the name field, for example.
          </p>
          <br />

          <h3>Search tutorial</h3>
          <p>
            To search for people in the Facebook, you can enter search terms to
            be matched in any part of their profiles. For example, searching for{" "}
            <code>Williams</code> yields everyone who lives in Williams Hall,
            all students from Williamstown (or any other town with
            &ldquo;Williams&rdquo; in its name), anyone with
            &ldquo;Williams&rdquo; in their name, etc.
          </p>
          <br />

          <h4>Combining search terms</h4>
          <p>
            Single-word searches are pretty boring and often yield more results
            than you want. You can combine multiple search terms to create more
            powerful queries. The simplest way to do this is to separate search
            terms by space as you would in an internet search. For example, to
            search for the Ephraim Williams (as there are so many of them) who
            lives in Dodd, we would use the query
          </p>
          <pre className="code">Ephraim Williams Dodd</pre>
          <p>or</p>
          <pre className="code">Ephraim &amp; Williams &amp; Dodd</pre>
          <p>
            Let&rsquo;s say we want a list of people living in the frosh quad.
            Alas, searching for <code>frosh quad</code> won&rsquo;t do it, but
            neither will <code>Williams Sage</code> or{" "}
            <code>Williams &amp; Sage</code>. What we want is{" "}
          </p>
          <pre className="code">Williams, Sage</pre>
          <p>or</p>
          <pre className="code">Williams | Sage</pre>
          <p>
            These will both yield all people who match &ldquo;Williams&rdquo; or
            &ldquo;Sage&rdquo;, or in other words, everyone who matches
            &ldquo;Williams&rdquo; plus everyone who matches &ldquo;Sage.&rdquo;
          </p>
          <p>
            You can surround any of these operators (&ldquo;&rdquo;, &ldquo;
            <code>&amp;</code>
            &rdquo;, &ldquo;
            <code>,</code>
            &rdquo;, &ldquo;
            <code>|</code>
            &rdquo;) with any number of spaces. Extra spaces will not change
            their meaning.
          </p>
          <br />

          <h4>Quotes</h4>
          <p>
            One problem you may see with all this is that it could be hard to
            search precisely for multi-word terms like &ldquo;San
            Francisco&rdquo; or &ldquo;Mark Hopkins.&rdquo; In reality,
            it&rsquo;s not often an issue, but in some cases we just don&rsquo;t
            want as results everyone matching &ldquo;Mark&rdquo; and
            &ldquo;Hopkins,&rdquo; but rather &ldquo;Mark Hopkins&rdquo;
            literally. In those cases you can use what probably seems the
            obvious approach: quotes. A search for{" "}
            <code>&ldquo;Mark Hopkins&rdquo;</code> does the trick.
          </p>
          <br />

          <h4>Labels</h4>
          <p>
            Another shortcoming of matching each search term against any part of
            a person&rsquo;s profile is that some searches, like finding someone
            named William who lives in... Williams Hall, are pretty much
            impossible. Luckily, we have labels to help narrow a search. For our
            hypothetical William of Williams Hall, we would use the following
            query:
          </p>
          <pre className="code">name:William &amp; dorm:Williams</pre>
          <p>
            It&rsquo;s quite likely that you could guess the right label name
            for the job, but here is a list of labels are currently supported.
          </p>
          <table className="inline">
            <tbody>
              <tr>
                <th> Label </th>
                <th> Searches by </th>
                <th> Pertains to </th>
              </tr>
              <tr>
                <td className="inline-display-text">
                  <pre className="code">building:</pre>
                  <p>,&nbsp;</p>
                  <pre className="code">bldg:</pre>
                  <p>, or&nbsp;</p>
                  <pre className="code">dorm:</pre>{" "}
                </td>
                <td> dorm (students) or building (faculty, staff) </td>
                <td> everyone </td>
              </tr>
              <tr>
                <td className="inline-display-text">
                  <pre className="code">city:</pre>
                  <p>&nbsp;or&nbsp;</p>
                  <pre className="code">town:</pre>
                </td>
                <td> hometown </td>
                <td> students </td>
              </tr>
              <tr>
                <td className="inline-display-text">
                  <pre className="code">class:</pre>
                  <p>&nbsp;or&nbsp;</p>
                  <pre className="code">year:</pre>
                </td>
                <td> class year </td>
                <td> students </td>
              </tr>
              <tr>
                <td className="code">country:</td>
                <td> home country </td>
                <td> students </td>
              </tr>
              <tr>
                <td className="inline-display-text">
                  <pre className="code">dept:</pre>
                  <p>&nbsp;or&nbsp;</p>
                  <pre className="code">department:</pre>
                </td>
                <td> department </td>
                <td> faculty, staff </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>email:</code>{" "}
                </td>
                <td>
                  {" "}
                  <em>First.M.Last</em> style email{" "}
                </td>
                <td> everyone </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>entry:</code>{" "}
                </td>
                <td> dorm entry letter or number </td>
                <td> students </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>major:</code>{" "}
                </td>
                <td> major (abbreviation) </td>
                <td> students </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>name:</code>{" "}
                </td>
                <td> name </td>
                <td> everyone </td>
              </tr>
              <tr>
                <td className="inline-display-text">
                  <pre className="code">neighborhood:</pre>
                  <p>&nbsp;or&nbsp;</p>
                  <pre className="code">cluster:</pre>
                </td>
                <td> campus neighborhood </td>
                <td> students </td>
              </tr>
              <tr>
                <td className="inline-display-text">
                  <pre className="code">phone:</pre>
                  <p>&nbsp;or&nbsp;</p>
                  <pre className="code">ext:</pre>{" "}
                </td>
                <td> campus phone number </td>
                <td> everyone </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>room:</code>{" "}
                </td>
                <td> room number </td>
                <td> students</td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>state:</code>{" "}
                </td>
                <td> home state </td>
                <td> students </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>title:</code>{" "}
                </td>
                <td> title </td>
                <td> faculty, staff </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>unix:</code>{" "}
                </td>
                <td> Unix ID </td>
                <td> everyone </td>
              </tr>
              <tr>
                <td className="code">
                  {" "}
                  <code>zip:</code>{" "}
                </td>
                <td> zip (postal) code of hometown </td>
                <td> students </td>
              </tr>
            </tbody>
          </table>

          <p>
            Spaces after the colon (&ldquo;:&rdquo;) in a label are optional,
            but you cannot put a space between the label and the colon.
          </p>
          <br />

          <h4>Parentheses</h4>
          <p>
            With the tools we have thus far, there are still some searches which
            would be difficult or annoying to do. For example, try to find all
            the people named Ephraim who live in the former freshman dorms that
            are now upperclass dorms (East, Fayerweather, Morgan, Lehman). Since
            the AND operators take precedence over the OR operators, we would
            have to type:
          </p>
          <pre className="code">
            name:Ephraim &amp; dorm:Lehman, name:Ephraim &amp; dorm:Morgan,
            name:Ephraim &amp; dorm:Fayerweather, name:Ephraim &amp; dorm:East
          </pre>
          <p>
            I can tell you from experience (having just typed this), that
            it&rsquo;s a pain. Instead, let&rsquo;s use parentheses and do an
            equivalent search:
          </p>
          <pre className="code">
            name:Ephraim &amp; dorm:(Lehman, Morgan, Fayerweather, East)
          </pre>
          <p>
            That was not quite as bad. You&rsquo;ll notice that, beyond the
            inclusion of parentheses, we&rsquo;ve also made use of the fact that
            a label applied to a parenthesized subquery is applied to each of
            the terms inside that query. This is very handy, since it requires
            writing the label just once... In addition, you can nest parentheses
            as many times as you&rsquo;d like and put spaces between parentheses
            and their contained search terms:{" "}
          </p>
          <pre className="code">
            name:(( Ephraim, Mark ) &amp; ( Williams, Hopkins) )
          </pre>
          <br />

          <h4>Precedence of operators</h4>
          <p>
            The operators discussed above group adjacent search terms in this
            order.
          </p>
          <ol>
            <li className="level1">
              <div className="li">
                {" "}
                <code>&ldquo;&rdquo;</code> &mdash; quotes
              </div>
            </li>
            <li className="level1">
              <div className="li">
                {" "}
                <code>()</code> &mdash; parentheses
              </div>
            </li>
            <li className="level1">
              <div className="li">
                {" "}
                <code>:</code> &mdash; labels
              </div>
            </li>
            <li className="level1">
              <div className="li">
                {" "}
                <code>&amp; </code> &mdash; ampersand and space (AND)
              </div>
            </li>
            <li className="level1">
              <div className="li">
                {" "}
                <code>|,</code> &mdash; pipe and comma (OR)
              </div>
            </li>
          </ol>
          <br />

          <hr />
          <div className="footnotes">
            <div className="fn">
              <a href="#fnt__1" id="fn__1" name="fn__1" className="fn_bot">
                1)
              </a>
              The <abbr title="Williams Students Online">WSO</abbr> Facebook
              actually predates Facebook.com by a bit and has been called
              &ldquo;the Facebook&rdquo; since its inception. To distinguish it
              from Facebook.com, which is commonly referred to as
              &ldquo;Facebook,&rdquo; refer to the{" "}
              <abbr title="Williams Students Online">WSO</abbr> Facebook as
              &ldquo;the
              <abbr title="Williams Students Online">WSO</abbr> Facebook,&rdquo;
              or &ldquo;the Facebook,&rdquo; for short.
              <br />
              <br />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default FacebookHelp;
