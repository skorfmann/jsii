﻿using System;
using System.Collections.Generic;
using System.Text;

namespace AWS.Jsii.Runtime.Services
{
    public interface IRuntime
    {
        string ReadResponse();

        void WriteRequest(string request);
    }
}